# Turborepo starter

**Description:**

This is a full stack TypeScript application that will let users connect external Music Streaming Services (ex: Spotify) all in one place. The app consists of:

- `soundbyte-web`: a front-end React/NestJs applcation where users can login and connect their Spotify account
- `streaming-api`: a back-end Node.js applcation using the NestJs framework, which handles the integration/authentication between the SoundByte app and the external Streaming services
- `infrastructure`: a PostgreSQL instance with multiple databases for user auth, and user data

NOTE: this app is still being developed

## Using this example

Run the following command:

```sh
npm install

npm run dev
```
