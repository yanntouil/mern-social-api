export default {
    port: 5000,
    appUrl: 'http://localhost:5000',
    corsOrigin: true,
    // Database
    dbUri: ``,
    databaseName: "",
    databaseUser: "",
    databasePassword: "",
    databaseUri: "",
    // Nodemailer
    mailFrom: '"Our website" <our-website@email.com>',
    mailHost: "",
    mailPort: 123,
    mailSecure: false,
    mailRequireTLS: true,
    mailUser: "",
    mailPassword: "",
    // JWT
    saltWorkFactor: 10,
    accessTokenTtl: "1y",
    refreshTokenTtl: "1y",
    emailTokenTtl: "1y",
    accessTokenPrivateKey: "",
    accessTokenPublicKey: "",
    refreshTokenPrivateKey: "",
    refreshTokenPublicKey: "",
    emailTokenPrivateKey: "",
    emailTokenPublicKey: "",
}