import MarkDownEditor from 'components/Editor/MilkdownEditor';
import styles from './index.module.scss';

export default function Home() {
  return (
    <div className={styles.root}>
      <h1>
        Welcome to EweNote{' '}
        <a href="notes-app">
          <button>Get started</button>
        </a>
      </h1>{' '}
      <MarkDownEditor
        readOnly
        content={`
## What

EweNote is a note taking app that gives you ownership and control over your data.

It is currently just a proof of concept. Do not store sensitive or important data in it.

## Why

User-owned data is a huge paradigm shift from the way we are currently accustomed to using the internet.

### Current paradigm:

You ask the app: Can I see my data? e.g.

> You ask Facebook:
> Can I see my friends list, please?

### User-owned data paradigm:

The app asks you: Can I see your data? e.g.

> Facebook asks you:
> Can I see your friends list?

This flipping of the ownership dynamic enables some important features:

- Users can leave the platform at any time and take their data with them to a new one with no loss.
- Apps cannot survive purely on vendor lock-in or network effects and must instead compete to provide the best experience for users.
- Third party apps can build new features and use your data in new innovative ways without relying on the first app's permission, or on them maintaining an API.
- Data changed in the user-owned database by one app will sync to other apps.
- Users can decide to give apps access to only certain parts of their data, and some parts can be read only.
- Users can get started or try out a new app with all their data ready, no onboarding, and able to enjoy all the features of the new app right away.

## How

EweNote stores your data in your [Matrix](https://matrix.org/) account in 'collections'. Each collection corresponds to a Matrix chat room, all stored under a space called "My Database".

EweNote and any other app you login to in the same way only has access to your app data and the chats you might have in that matrix account while you are using the app. You might consider making a dedicated Matrix account that you don't use for chat. Your Matrix homeserver also has access to your data, but you can self-host or use a homeserver that you trust. You will soon also be able to encrypt your data before it is sent to your homeserver, so that even your homeserver cannot read it.

`}
      />
      <p>
        Please consider contributing to the project on{' '}
        <a href="https://github.com/jacobcoro/eduvault-matrix-crdt">GitHub</a>.
      </p>
      <p> </p>
      <p>
        Or contact me through my{' '}
        <a href="https://jacobcohen-rosenthal.me">website</a>.
      </p>
    </div>
  );
}
