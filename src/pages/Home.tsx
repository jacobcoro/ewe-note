import styles from './index.module.scss';

export default function Home() {
  return (
    <div className={styles.root}>
      <h1>Welcome to Eduvault</h1>
      <h3>About</h3>
      <p>
        Eduvault is an interoperable EdTech app. It leverages{' '}
        <a href="https://matrix.org/">Matrix</a> to provide a user-owned and
        local-first database. It is currently just a proof of concept.
      </p>
      <p>
        Please consider contributing to the project on{' '}
        <a href="https://github.com/jacobcoro/eduvault-matrix-crdt">GitHub</a>.
      </p>
      <p>
        Or contact me through my{' '}
        <a href="https://jacobcohen-rosenthal.me">website</a>.
      </p>
      <p>
        <a href="login">Get started</a> now
      </p>
    </div>
  );
}
