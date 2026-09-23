# PassGen
# EN
🔐 PassGen

A local-first desktop password generator focused on strong passwords, privacy, and customizable variations.

PassGen is a simple desktop application designed to generate strong passwords locally, without requiring an internet connection for its core password-generation features.

In addition to random password generation, PassGen can create variations from a word or base password and suggest related words based on topics you are interested in.

The goal is to combine password security, customization, and privacy in a simple interface.

✨ Features
🎲 Random Password Generator

Generate random passwords with customizable options:

Length from 5 to 24 characters
Uppercase letters
Lowercase letters
Numbers
Symbols
Password strength indicator
🔄 Password Variations

Start with a word or base password and generate multiple variations using transformations such as:

Uppercase and lowercase variations
Leet-speak substitutions
Symbol insertion
Different combinations of the original word

These transformations are processed locally.

💡 Topic-Based References

Enter a topic you are interested in and PassGen can suggest related words that can be used as a starting point for password variations.

For example:

Topic: Space

Possible references:
- Galaxy
- Nebula
- Apollo
- Saturn
- Cosmos

These words can then be used as a basis for generating password variations.

🌙 Dark Mode

PassGen includes a dark mode and remembers your preference between sessions.

🔒 Local Processing

The core password generation and local variation features are processed directly on the user's device.

Generated passwords do not need to be sent to a remote server.

Important: topic-based suggestions may use external APIs or AI services depending on the configured provider. This feature should therefore be considered separately from the fully local password-generation functionality.

🧠 How It Works

PassGen has two main approaches to password generation.

Random Generation

The application generates passwords using the character sets selected by the user:

Uppercase
Lowercase
Numbers
Symbols

The user controls the desired password length and character types.

Base Password Variations

The user can provide a word or password and generate variations from it.

For example:

Base:
Dragon

Variations:
Dr4g0n!
DRAGON#24
dr4g0n$
DraG0n@7

The goal is to provide different combinations while keeping the original theme recognizable.

🌐 Topic-Based References

The topic-reference feature can retrieve related words using external sources.

Depending on the configured implementation, it can use:

AI-based suggestions
Wikipedia
MuseData
Artifact API

This feature is intended to help users find words related to a subject they like before generating password variations.

Privacy Consideration

Unlike the local password generator, topic-based suggestions may require sending the topic entered by the user to an external service.

No password should be sent to these services as part of the local password-generation workflow.

🖥️ Application

PassGen is designed as a desktop application with a simple and straightforward interface.

Main workflow
Choose password settings
        ↓
Generate password
        ↓
Check password strength
        ↓
Copy / use the generated password

Or:

Enter a topic or base word
        ↓
Find related references
        ↓
Generate variations
        ↓
Choose a password
🛠️ Technologies

The project currently uses a web-based application structure packaged as a desktop application.

Main project files include:

PassGen/
├── .github/
│   └── workflows/
├── app/
├── index.html
├── main.js
├── package.json
└── README.md
🚀 Getting Started
Requirements

Make sure you have the project's required runtime and dependencies installed.

Clone the repository:

git clone https://github.com/Exgrex/PassGen.git

Enter the project directory:

cd PassGen

Install dependencies:

npm install

Then start the application using the development command defined in package.json.

npm start

The exact command may vary depending on the scripts configured in package.json.

🔐 Security & Privacy

PassGen was designed around the idea that password generation should be possible without unnecessarily sending password data to external services.

Local features

The following operations are designed to run locally:

Random password generation
Password variation generation
Leet-speak transformations
Character substitutions
Password strength calculation
Dark-mode preference
External features

Topic-based reference suggestions may communicate with external services depending on the selected provider.

For this reason:

Never enter an existing real password into the topic/reference feature.

For maximum security, generated passwords should also be stored using a reputable password manager rather than reused across multiple services.

📌 Project Status

PassGen is an ongoing personal development project.

Current functionality includes:

Random password generation

Password length control

Character-type selection

Password strength indicator

Dark mode

Local password variations

Topic-based references

External reference providers

Future improvements may include:

Additional password-generation options

More variation algorithms

Improved password-strength analysis

Additional reference providers

UI/UX improvements

Automated testing

Production releases

🎯 Motivation

PassGen was created as a practical project to explore desktop application development, password generation, local processing, APIs, and privacy-oriented software design.

The project also serves as an opportunity to experiment with integrating external information sources while keeping the core password-generation workflow local.

📄 License

This project is currently available on GitHub as a public repository.

See the repository for the current licensing information.

👤 Author

Developed by Exgrex.

GitHub:
https://github.com/Exgrex

Project:
https://github.com/Exgrex/PassGen



