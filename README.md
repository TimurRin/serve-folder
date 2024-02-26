# Cinnabar Forge SnapServe

Web-serve your folders in a snap using various view modes

```
TODO
```

## Getting Started

### Installation

Install SnapServe globally using npm:

```bash
npm install -g snapserve
```

To access global plugins (`snapserve-*`), use `export NODE_PATH=$(npm root -g)`. To make the `NODE_PATH` setting permanent for Node.js, you can add it to your user's profile configuration file. This file is typically `~/.bash_profile`, `~/.bashrc`, `~/.profile`, or `~/.zshrc`, depending on which shell you are using.

### Configuration

File `~/.config/cinnabar-forge/snapserve/users.json` contains login-password pairs for Basic Authorization

### Usage

Serve current directory:
```bash
snapserve
```

Serve current directory at port `42069`:
```bash
snapserve -p 42069
```

Serve directory `/home/user/nice`:
```bash
snapserve -f /home/user/nice
```

Serve current directory with disabled Basic Authorization:
```bash
snapserve --noAuth
```

Serve current directory with built-in `gallery` mode:
```bash
snapserve -m gallery
```

Serve current directory with `snapserve-wonka` npm package:
```bash
snapserve -m npm-wonka
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or create a pull request.

Clone the repository and install dependencies:

```bash
git clone git@github.com:cinnabar-forge/snapserve.git
cd snapserve
npm ci
```

You can also develop a plugin! See [snapserve-wonka](https://github.com/cinnabar-forge/snapserve-wonka) as example to start.

## License

Cinnabar Forge SnapServe is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Authors

- Timur Moziev ([@TimurRin](https://github.com/TimurRin))
