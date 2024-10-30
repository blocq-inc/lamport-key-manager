# Lamport Key Manager

Lamport Key Manager is a library for managing Lamport keys.

## Installation

```bash
npm install @blocq-inc/lamport-key-manager
```

```
yarn add @blocq-inc/lamport-key-manager
```

## Usage

1. key generation and save to file

```typescript
import { LamportKeyManager } from "@blocq-inc/lamport-key-manager";

// this will generate keys and save to file in current directory
const manager = new LamportKeyManager();

// this will generate next keys and save to file
manager.generateNextKeys();

// these gets current private key, public key, lamport key pair, and public key hash
const currentPrivKey = manager.currentPrivKey;
const currentPubKey = manager.currentPubKey;
const currentLamportKeyPair = manager.currentLamportKeyPair;
const currentPubKeyHash = manager.currentPubKeyHash;
```

2. sign message

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

- link local package

```bash
yarn link
```

- unlink local package, re-build and link again after updating the code for the local development

```bash
yarn unlink && yarn build && yarn link
```
