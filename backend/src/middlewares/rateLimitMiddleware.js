import rateLimiter from 'express-rate-limit'

const limiter = rateLimiter({
    windowMs: 30 * 60 * 1000, // 30 minutes
    limit: 20,
    message: {error: "Troppe richieste. Riprova più tardi"}
})

export default limiter
