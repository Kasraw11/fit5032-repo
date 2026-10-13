const { onRequest, onCall, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret, defineString } = require('firebase-functions/params')
const admin = require('firebase-admin')
const sgMail = require('@sendgrid/mail')

admin.initializeApp()

exports.ensureGoogleUserProfile = onCall(
  {
    region: 'us-central1',
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Please sign in first.')
    }
    if (request.auth.token.firebase.sign_in_provider !== 'google.com') {
      throw new HttpsError('permission-denied', 'Google sign-in required.')
    }
    try {
      const user = await admin.auth().getUser(request.auth.uid)
      if (user.disabled) {
        throw new HttpsError('permission-denied', 'Account unavailable.')
      }
      const database = admin.firestore()
      const profile = database.collection('users').doc(user.uid)
      await database.runTransaction(async (transaction) => {
        const existingProfile = await transaction.get(profile)
        if (!existingProfile.exists) {
          transaction.create(profile, { role: 'user' })
        }
      })
      return { success: true }
    } catch (error) {
      if (error instanceof HttpsError) throw error
      throw new HttpsError('internal', 'Unable to prepare your account.')
    }
  },
)

const sendgridApiKey = defineSecret('SENDGRID_API_KEY')
const senderEmail = defineSecret('SENDER_EMAIL')
const supportEmail = defineSecret('SUPPORT_EMAIL')
const mapboxAccessToken = defineString('MAPBOX_ACCESS_TOKEN')

exports.sendSupportEmail = onRequest(
  {
    secrets: [sendgridApiKey, senderEmail, supportEmail],
  },
  async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    response.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.set('Access-Control-Allow-Headers', 'Content-Type')
    if (request.method === 'OPTIONS') {
      response.status(204).send('')
      return
    }
    if (request.method !== 'POST') {
      response.status(405).json({ success: false, message: 'Use POST.' })
      return
    }

    const body = request.body || {}
    for (const field of ['name', 'email', 'subject', 'message']) {
      if (typeof body[field] !== 'string' || !body[field].trim()) {
        response.status(400).json({
          success: false,
          message: 'Unable to send support email',
        })
        return
      }
    }
    const name = body.name.trim()
    const email = body.email.trim()
    const subject = body.subject.trim()
    const message = body.message.trim()
    if (
      name.length > 100 ||
      email.length > 254 ||
      subject.length > 200 ||
      message.length > 5000 ||
      /[\r\n]/.test(subject) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      response.status(400).json({
        success: false,
        message: 'Unable to send support email',
      })
      return
    }

    let attachment
    if (body.attachment != null) {
      const file = body.attachment
      if (
        typeof file.filename !== 'string' ||
        typeof file.type !== 'string' ||
        typeof file.content !== 'string'
      ) {
        response.status(400).json({
          success: false,
          message: 'Unable to send support email',
          attachmentError: 'Invalid attachment.',
        })
        return
      }
      const filename = file.filename.toLowerCase()
      const validType =
        (file.type === 'application/pdf' && filename.endsWith('.pdf')) ||
        (file.type === 'image/png' && filename.endsWith('.png')) ||
        (file.type === 'image/jpeg' && /\.jpe?g$/.test(filename))
      const maxBytes = 3 * 1024 * 1024
      if (
        !validType ||
        !file.filename.trim() ||
        file.filename.length > 120 ||
        /[\\/]/.test(file.filename) ||
        !file.content.length
      ) {
        response.status(400).json({
          success: false,
          message: 'Unable to send support email',
          attachmentError: 'Please select a PDF, PNG or JPG file.',
        })
        return
      }
      if (file.content.length > 4 * Math.ceil(maxBytes / 3)) {
        response.status(413).json({
          success: false,
          message: 'Unable to send support email',
          attachmentError: 'Attachment must be smaller than 3 MB.',
        })
        return
      }
      const bytes = Buffer.from(file.content, 'base64')
      if (!bytes.length || bytes.toString('base64') !== file.content) {
        response.status(400).json({
          success: false,
          message: 'Unable to send support email',
          attachmentError: 'Invalid attachment.',
        })
        return
      }
      if (bytes.length >= maxBytes) {
        response.status(413).json({
          success: false,
          message: 'Unable to send support email',
          attachmentError: 'Attachment must be smaller than 3 MB.',
        })
        return
      }
      attachment = {
        filename: file.filename.trim(),
        type: file.type,
        content: file.content,
        disposition: 'attachment',
      }
    }

    try {
      sgMail.setApiKey(sendgridApiKey.value())
      const emailData = {
        to: supportEmail.value(),
        from: senderEmail.value(),
        replyTo: email,
        subject,
        text:
          'SmartLoop Support Request\n\n' +
          `Name: ${name}\nEmail: ${email}\n` +
          `Subject: ${subject}\n\nMessage:\n${message}`,
      }
      if (attachment) emailData.attachments = [attachment]
      await sgMail.send(emailData)
      response.status(200).json({
        success: true,
        message: 'Support email sent successfully',
      })
    } catch (error) {
      console.error('Unable to send support email.')
      response.status(502).json({
        success: false,
        message: 'Unable to send support email',
      })
    }
  },
)

exports.getUserCount = onRequest(
  {
    region: 'us-central1',
    timeoutSeconds: 120,
  },
  async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    response.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.set('Cache-Control', 'no-store')
    if (request.method === 'OPTIONS') {
      response.status(204).send('')
      return
    }
    if (request.method !== 'POST') {
      response.status(405).json({ success: false, message: 'Use POST.' })
      return
    }

    const authorization = request.get('Authorization') || ''
    if (!authorization.startsWith('Bearer ')) {
      response.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
      return
    }
    let currentUser
    try {
      currentUser = await admin.auth().verifyIdToken(authorization.slice(7))
    } catch (error) {
      response.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
      return
    }

    try {
      const user = await admin.firestore().collection('users').doc(currentUser.uid).get()
      if (!user.exists || user.data().role !== 'admin') {
        response.status(403).json({
          success: false,
          message: 'Admin access required.',
        })
        return
      }
      let userCount = 0
      let nextPage
      do {
        const result = await admin.auth().listUsers(1000, nextPage)
        userCount += result.users.length
        nextPage = result.pageToken
      } while (nextPage)
      response.status(200).json({ success: true, userCount })
    } catch (error) {
      console.error('Unable to count users.')
      response.status(500).json({
        success: false,
        message: 'Unable to load user count.',
      })
    }
  },
)

exports.sendBulkEmail = onRequest(
  {
    region: 'us-central1',
    timeoutSeconds: 300,
    secrets: [sendgridApiKey, senderEmail],
  },
  async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    response.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (request.method === 'OPTIONS') {
      response.status(204).send('')
      return
    }
    if (request.method !== 'POST') {
      response.status(405).json({ success: false, message: 'Use POST.' })
      return
    }

    const authorization = request.get('Authorization') || ''
    if (!authorization.startsWith('Bearer ')) {
      response.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
      return
    }
    let currentUser
    try {
      currentUser = await admin.auth().verifyIdToken(authorization.slice(7))
    } catch (error) {
      response.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
      return
    }

    let sentCount = 0
    try {
      const database = admin.firestore()
      const user = await database.collection('users').doc(currentUser.uid).get()
      if (!user.exists || user.data().role !== 'admin') {
        response.status(403).json({
          success: false,
          message: 'Admin access required.',
        })
        return
      }
      const body = request.body || {}
      const categories = ['Donations', 'Workshops', 'Events', 'Recycling Centres', 'Repair Centres']
      if (
        !categories.includes(body.category) ||
        typeof body.subject !== 'string' ||
        !body.subject.trim() ||
        typeof body.message !== 'string' ||
        !body.message.trim() ||
        body.subject.length > 200 ||
        body.message.length > 5000 ||
        /[\r\n]/.test(body.subject)
      ) {
        response.status(400).json({
          success: false,
          message: 'Unable to send notification emails.',
        })
        return
      }
      const snapshot = await database
        .collection('categorySubscriptions')
        .where('category', '==', body.category)
        .get()
      const emails = []
      for (const document of snapshot.docs) {
        const email = document.data().email
        if (typeof email !== 'string') continue
        const address = email.trim().toLowerCase()
        if (
          address.length <= 254 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) &&
          !emails.includes(address)
        )
          emails.push(address)
      }
      if (!emails.length) {
        response.status(400).json({
          success: false,
          message: 'No subscribers found for this category.',
        })
        return
      }
      sgMail.setApiKey(sendgridApiKey.value())
      for (const email of emails) {
        await sgMail.send({
          to: email,
          from: senderEmail.value(),
          subject: body.subject.trim(),
          text: body.message.trim(),
        })
        sentCount += 1
      }
      response.status(200).json({ success: true, sentCount })
    } catch (error) {
      console.error('Unable to send notification emails.')
      response.status(502).json({
        success: false,
        message: 'Unable to send notification emails.',
        sentCount,
      })
    }
  },
)

exports.findLocation = onRequest(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
  },
  async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    response.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (request.method === 'OPTIONS') {
      response.status(204).send('')
      return
    }
    if (request.method !== 'POST') {
      response.status(405).json({ success: false, message: 'Use POST.' })
      return
    }

    const authorization = request.get('Authorization') || ''
    if (!authorization.startsWith('Bearer ')) {
      response.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
      return
    }
    let currentUser
    try {
      currentUser = await admin.auth().verifyIdToken(authorization.slice(7))
    } catch (error) {
      response.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
      return
    }

    try {
      const user = await admin.firestore().collection('users').doc(currentUser.uid).get()
      if (!user.exists || user.data().role !== 'admin') {
        response.status(403).json({
          success: false,
          message: 'Admin access required.',
        })
        return
      }
      const body = request.body || {}
      if (
        typeof body.address !== 'string' ||
        body.address.trim().length < 3 ||
        body.address.length > 300
      ) {
        response.status(400).json({
          success: false,
          message: 'Unable to find the address.',
        })
        return
      }
      const parameters = new URLSearchParams({
        q: body.address.trim(),
        country: 'au',
        proximity: '145.13,-37.91',
        autocomplete: 'false',
        limit: '5',
        permanent: 'true',
        access_token: mapboxAccessToken.value(),
      })
      const result = await fetch('https://api.mapbox.com/search/geocode/v6/forward?' + parameters, {
        signal: AbortSignal.timeout(15000),
      })
      if (!result.ok) throw new Error('Address lookup failed.')
      const data = await result.json()
      const locations = []
      for (const feature of data.features || []) {
        const coordinates = feature.geometry && feature.geometry.coordinates
        const longitude = coordinates && coordinates[0]
        const latitude = coordinates && coordinates[1]
        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          continue
        }
        const properties = feature.properties || {}
        let address = properties.full_address || properties.name || ''
        if (!properties.full_address && properties.place_formatted) {
          address += (address ? ', ' : '') + properties.place_formatted
        }
        if (address) {
          locations.push({
            id: feature.id || address,
            address,
            latitude,
            longitude,
          })
        }
      }
      response.status(200).json({ success: true, locations })
    } catch (error) {
      console.error('Unable to find the address.')
      response.status(502).json({
        success: false,
        message: 'Unable to find the address.',
      })
    }
  },
)
