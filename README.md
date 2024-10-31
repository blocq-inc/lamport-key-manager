# Lamport Key Manager

`Lamport Key Manager` is a library for managing and signing messages with Lamport keys.

## Installation

```bash
npm install @blocq-inc/lamport-key-manager
```

```bash
yarn add @blocq-inc/lamport-key-manager
```

## Usage

- key generation and save to file

```typescript
import { LamportKeyManager } from "@blocq-inc/lamport-key-manager";

// this will generate keys in `./keys/keys.json` and save to file in current directory
const manager = new LamportKeyManager();

// this will generate next keys and save to file
manager.generateNextKeys();

// these gets current private key, public key, lamport key pair, and public key hash
const currentPrivKey = manager.currentPrivKey;
const currentPubKey = manager.currentPubKey;
const currentLamportKeyPair = manager.currentLamportKeyPair;
const currentPubKeyHash = manager.currentPubKeyHash;
```

- signing message

```typescript
import { LamportSigner } from "@blocq-inc/lamport-key-manager";

// this loads keys from file in current directory
const manager = new LamportKeyManager("load");

const signer = new LamportSigner(manager.currentLamportKeyPair);

const message = "hello";
// this will sign message with current lamport key pair(private key)
const signature = signer.sign(message);

// this will verify signature with current public key
const result = signer.verify(message, signature);

// After signing, generate next keys because lamport key pair must not be reused.
manager.generateNextKeys();
```

## Development tips

- run test

```bash
yarn test
```

- run type check

```bash
yarn type-check
```

- build

```bash
yarn build
```

- link local package

```bash
yarn link
```

- unlink local package, re-build and link again after updating the code for the local development

```bash
yarn relink
```

## TODO

- [ ] add tests
- [ ] add options for hash functions(e.g. sha256)
