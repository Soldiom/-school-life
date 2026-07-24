# School Life privacy notice

Last updated: 24 July 2026

This notice describes the open-source School Life web app in this repository. A person or organization that changes or hosts the code is responsible for documenting its own data practices.

## Data used by this release

School Life asks for a display name, learning level, and avatar. It also records learning progress, rewards, room decorations, completed activities, daily/weekly activity, and accessibility preferences.

All of that information stays in the learner's browser using local storage. This release:

- has no account system or remote learner database;
- does not send profile or progress data to Soldiom;
- has no analytics, advertising, behavioral tracking, or third-party sign-in;
- has no open chat, user-generated posts, camera capture, or microphone capture;
- uses browser speech synthesis for read-aloud without uploading lesson text; and
- caches static app files on the device so the app can work offline.

The hosting provider may process ordinary web-server information such as IP addresses and request logs under its own terms. A school or other operator should evaluate its chosen host separately.

## Control and deletion

Use **Profile → Start over with a new explorer** to remove the School Life profile from local storage. Browser or device settings can also clear site data, including the offline cache.

Because this release has no remote database, the project maintainers cannot retrieve, restore, or remotely delete a learner's local profile.

## Children and schools

The app is designed to minimize collection, but technical minimization alone does not make every deployment compliant. Before a child-facing or school deployment, the operator should complete applicable privacy, safeguarding, accessibility, security, consent, retention, and vendor reviews for its jurisdiction.

Do not include a child's name, contact details, school, location, or learning record in a public GitHub issue.

## Future changes

Cloud sync, real-user groups, voice recording, analytics, payments, or AI services must not be added without a new privacy assessment, updated notice, appropriate controls, and any required consent.

Questions about this repository can be raised through GitHub without including personal information.
