# OOP Dev Data Card Generator

Reads `devData.json` from the filesystem (Node `fs`), serves it at `/api/devs`, and renders developer cards dynamically in the browser using OOP JavaScript.

## How to Run
```bash
# Install dependencies (optional, for fontawesome if local)
npm init -y

# Start server
node server.js

# Open in browser
http://localhost:3000
```

## Deliverables
- Pure JS rendering (no HTML elements hardcoded in index.html).
- JSON data loaded with `fs` on backend.
- OOP class (`DevCardManager`) builds cards dynamically.

## UML Diagram
```mermaid
classDiagram
  class DevCardManager {
    - Array~Dev~ #data
    - String dataUrl
    - Element cardsContainer
    + constructor(options)
    + init() Promise~void~
    - #loadData() Promise~void~
    - #buildBaseLayout() void
    + renderAll() void
    + createCardElement(dev) Element
  }

  class Dev {
    + Number userID
    + String userName
    + Number yearsXP
    + Boolean isActive
    + String pictureURL
    + String email
    + String phone
    + Array~String~ skills
    + String bio
  }
```
