Infrastructure for CST
======================

HTTPS for local development
---------------------------
In order to set up Apache or another web server properly with HTTPS for development on [localhost](https://localhost:443), it becomes necessary to generate and approve your own local certificate.

**NOTE**: this is actually a _prerequisite_ - along with installing Docker itself - if you want to spin up a [repository.clarin.dk](https://github.com/kuhumcst/infrastructure/tree/master/repository.clarin.dk) Docker container locally.

## Generating a certificate
[Let's Encrypt](https://letsencrypt.org/docs/certificates-for-localhost/) provides a simple one-liner using `openssl`. Here is a slightly modified version:

```
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

This generates a `localhost.crt` and a `localhost.key` file. You should make sure to do this in the root directory of this git project since e.g. [the Dockerfile for repository.clarin.dk](https://github.com/kuhumcst/infrastructure/blob/master/repository.clarin.dk/Dockerfile) expects the files in that location.

If you already have some certificates lying around that you want to reuse then just drop them in the same place with the same file names.

## Adding to trusted certificates
In order for this to work, the `localhost.crt` file should be added to your list of trusted certificates. Otherwise your browser could possibly block the HTTPS connection or at the very least display some annoying warning message.

On macOS (as an example), trusting a certificate is done by 

* opening up `Keychain Access.app`
* importing the `localhost.crt` file
* ensuring that it is fully trusted by double clicking on the newly added `localhost` listing and selecting _"Always allow"_.
