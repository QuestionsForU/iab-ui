# iLab UI Developer Guide

This guide is for developers setting up, maintaining, and extending the iLab UI web application.

## What this application does

iLab UI is a React single-page application for business administration. It includes authentication and management screens for areas such as products, categories, suppliers, purchases, invoices, sale orders, customers, users, roles, and project/building records. The application uses Firebase Authentication and Cloud Firestore for its backend.

## Technology

- React 18, created with Create React App (`react-scripts`)
- React Router 6 for client-side routing
- Redux Toolkit and `redux-persist` for application state
- Firebase JavaScript SDK for Authentication, Firestore, and Analytics
- React Bootstrap and Bootstrap for UI components and styling
- Firebase Hosting for static web deployment

## Get the project running

Prerequisites:

- Node.js and npm compatible with the versions used by the project dependencies
- Access to the correct Firebase project for local development
- Git

From the repository root:

```powershell
npm ci
npm start
```

Open `http://localhost:3000`. The development server reloads after source changes. Stop it with `Ctrl+C`.

The current `build` npm script uses POSIX environment-variable syntax (`CI=false react-scripts build`), which fails on Windows Command Prompt and PowerShell. To build on Windows without changing `package.json`, run:

```powershell
npx react-scripts build
```

On shells that support the existing npm script syntax, use:

```bash
npm run build
```

The production bundle is generated in `build/`. `npm test` starts the Create React App test runner; use `npx react-scripts test --watchAll=false` for a non-watch run.

## Project layout

```text
src/
  App.js                       Auth provider and route entry point
  index.js                     React root, Redux provider, persisted store
  Layout.jsx                   Authenticated application shell
  routes/
    index.jsx                  Public, authentication, and protected routes
    ProtectedRoute.jsx         Authentication gate for the app shell
  provider/
    authProvider.jsx           Authentication context and browser storage
  store/
    firebase.js                Firebase app, Auth, Firestore, Analytics setup
    firebase-service.js        Firestore/Auth operations used by Redux
    api-db.js                  Redux thunks, slice, and API state
    index.js                   Redux store and session persistence
  configuration/
    modules.jsx                Module configuration screens/examples
  pages/
    app/schema/                Domain list, view, add, and edit screens
    common/                    Shared layout, list, form, and UI components
  assets/                      Stylesheets, images, and fonts
public/                         Static files copied into the build
firebase.json                  Firebase Hosting and Firestore config paths
.firebaserc                    Firebase CLI project alias
firestore.rules                Firestore access rules
firestore.indexes.json         Firestore composite index definitions
```

## Application flow and extension points

### Startup, routing, and authentication

`src/index.js` mounts the React app with the Redux provider and waits for persisted Redux state to rehydrate. `src/App.js` provides the authentication context and renders the route configuration.

Routes are declared in `src/routes/index.jsx`. Public/authentication paths include `/login`, `/signup`, `/forgot-password`, `/reset-password`, and `/refresh`. Most business screens are nested under the protected route and rendered inside `Layout.jsx`. `ProtectedRoute.jsx` redirects unauthenticated users to login (or token refresh when a refresh token exists).

Authentication state is implemented in `src/provider/authProvider.jsx`. It stores the session token in `sessionStorage` and a refresh token in `localStorage`. When changing login or logout behavior, check the auth provider, protected route, and the login/refresh/logout pages together.

### State and Firebase data access

The UI dispatches Redux Toolkit thunks from `src/store/api-db.js`. These call the Firebase operations in `src/store/firebase-service.js`, which uses the Firestore instance exported by `src/store/firebase.js`. The Redux store is in `src/store/index.js`; its persisted state uses session storage.

Common data thunks include `getData`, `getSingleData`, `addData`, `editData`, and `deleteData`. Identity-related thunks include login, registration, profile update, and password reset/change actions. Follow these existing paths when adding data operations so loading, success, and error state remains consistent.

The generic screens in `src/pages/common/IUIList.jsx` and `src/pages/common/IUIPage.jsx` take a schema describing the Firestore collection and form/list fields. Domain-specific examples and their collection names live in `src/pages/app/schema/`. For a new domain screen:

1. Define its schema and collection name using an existing domain page as a pattern.
2. Reuse the shared list/form components where their behavior fits.
3. Add the page route in `src/routes/index.jsx`.
4. Add or update navigation and any related lookup schemas.
5. Review Firestore indexes and rules for the new collection and queries.
6. Exercise listing, search/sort, create, view, edit, and access behavior.

Check the details of the shared components before assuming all pages have the same capabilities; some add routes or actions are intentionally absent from the current router.

## Firebase setup and deployment

Firebase is initialized in `src/store/firebase.js`. The Firebase client configuration identifies a Firebase project; do not treat it as an authorization boundary. Data access must be secured by Firestore rules, and Firebase Auth/provider settings must be configured in the Firebase Console.

There is a project-alias mismatch to verify before any Firebase CLI deployment: `.firebaserc` currently selects `zorya-lis` as `default`, while the Firebase client configuration in `src/store/firebase.js` is configured for `ilab-ui`. Confirm the intended target with the project owner and ensure local configuration and CLI target agree. Inspect the selected target before deploying:

```powershell
firebase projects:list
firebase use
```

Build and deploy Hosting to an explicitly selected project:

```powershell
npx react-scripts build
firebase deploy --project <project-id> --only hosting
```

Replace `<project-id>` with the approved Firebase project ID. `firebase.json` serves the `build` directory. Deploying Hosting publishes the already-built static assets; run the build again after source changes.

Deploy the Firestore index definitions separately when they change:

```powershell
firebase deploy --project <project-id> --only firestore:indexes
```

Firestore rules are configured in `firebase.json` to come from `firestore.rules`. **Do not deploy the current rules to a live project without first reviewing and replacing them.** The checked-in rule grants broad read/write access only until a fixed date in 2025, which has passed. Write and test restrictive rules that match the app's intended users and data access, and coordinate production rule changes with the project owner.

## Firestore data and indexes

Collections are selected by module/collection names passed by the domain screens and Firebase service. The service adds common metadata on create, including `status`, `schema`, `user`, `dateCreated`, `application`, and `access`. Review the implementation before changing this metadata: some values are currently hard-coded and may not represent the active user's identity or the desired environment.

Composite indexes are kept in `firestore.indexes.json`; the existing entries primarily support collection queries filtered by `application` and ordered by `dateCreated`. Firestore reports a missing-index link when a query needs an index that is not present. Verify that the generated index matches the intended query, update the checked-in JSON, then deploy the index definitions to the correct project.

## Useful commands

| Purpose | Command |
| --- | --- |
| Install exact lockfile dependencies | `npm ci` |
| Start local development server | `npm start` |
| Run tests interactively | `npm test` |
| Run tests once | `npx react-scripts test --watchAll=false` |
| Build on Windows with the current scripts | `npx react-scripts build` |
| Build where POSIX npm scripts are supported | `npm run build` |
| Deploy Hosting to a named project | `firebase deploy --project <project-id> --only hosting` |
| Deploy Firestore indexes to a named project | `firebase deploy --project <project-id> --only firestore:indexes` |

## Troubleshooting

- **Firebase Hosting Setup Complete appears on the deployed site:** Build the React app first and deploy Hosting from the repository root. Check that `build/index.html` exists and that `firebase.json` points Hosting at `build`.
- **`'CI' is not recognized` during `npm run build`:** Use `npx react-scripts build` on Windows with the current `package.json`.
- **Firebase reports HTTP 401 or invalid credentials:** Re-authenticate with `firebase login`, verify the Google account has access, and confirm the project ID. An expired or unauthorized Firebase CLI login is separate from the app's Firebase client configuration.
- **Firestore reports a missing index:** Review the query and the proposed index, update `firestore.indexes.json`, and deploy indexes to the intended project.
- **Firestore reads/writes are denied:** Check the deployed rules, user's Firebase Authentication state, and target project. Do not loosen production rules as a shortcut.
- **A deep link fails after Hosting deployment:** Verify Firebase Hosting rewrite behavior for this React Router single-page app and configure an SPA rewrite to `/index.html` if required.

## Developer checklist

Before opening a pull request or deploying:

- Run the relevant tests and a production build.
- Verify that changes work with the intended Firebase project, not just the CLI default.
- Review Firestore query/index implications and security rules for data changes.
- Do not commit service account credentials, private keys, or production user data.
- Test protected and unauthenticated navigation when changing routes or authentication.
