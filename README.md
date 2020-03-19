## API with Cognito

This is a prototype of an API in Node JS to test how integration with Cognito works for Authentication of users.

### Installation

1. Install dependencies: `npm install`

2. Run app: `npm start`

### Development

To start developing run: `npm run dev`


### Test Authentication

After starting the app (`npm start`), run:

```
$ curl -XPOST -H "Content-type: application/json" \
  --data '{"username": "monzo2", "password": "xxxxxxxxxxxxxx"}' \
  localhost:8080/api/auth/token
```

This assumes that the user is created in Cognito user pool.
