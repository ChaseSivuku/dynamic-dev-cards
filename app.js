class DevCardManager {
  #data = [];

  constructor({ dataUrl = '/api/devs' } = {}) {
    this.dataUrl = dataUrl;
  }

  async init() {
    await this.#loadData();
    this.#buildBaseLayout();
    this.renderAll();
  }

  async #loadData() {
    try {
      const res = await fetch(this.dataUrl);
      this.#data = await res.json();
    } catch (err) {
      console.error("Failed to load devData.json", err);
      this.#data = [];
    }
  }

  #buildBaseLayout() {
    document.body.innerHTML = "";

    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `<h1>Developer Directory</h1>`;
    document.body.appendChild(header);

    const main = document.createElement("main");
    this.cardsContainer = document.createElement("section");
    this.cardsContainer.className = "card-grid";
    main.appendChild(this.cardsContainer);
    document.body.appendChild(main);

    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `<small>&copy; 2025 Dev Cards</small>`;
    document.body.appendChild(footer);
  }

  renderAll() {
    this.cardsContainer.innerHTML = "";
    this.#data.forEach(dev => {
      const card = this.createCardElement(dev);
      this.cardsContainer.appendChild(card);
    });
  }

  createCardElement(dev) {
    const {
      userID,
      userName,
      yearsXP,
      isActive,
      pictureURL,
      email,
      phone,
      skills,
      bio
    } = dev;

    const card = document.createElement("article");
    card.className = "card";
    card.dataset.userid = userID;

    const top = document.createElement("div");
    top.className = "top";
    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = pictureURL || "https://via.placeholder.com/150?text=Dev";
    avatar.alt = `${userName}'s avatar`;
    const topInfo = document.createElement("div");
    topInfo.innerHTML = `
      <div class="name-line">
        <h3 style="margin:0">${userName}</h3>
        <span class="badge"><i class="fa-solid fa-code"></i> ${yearsXP} yrs</span>
        <span class="badge ${isActive ? "active" : ""}">
          ${isActive ? '<i class="fa-solid fa-circle-check"></i> Active' : '<i class="fa-regular fa-circle"></i> Inactive'}
        </span>
      </div>
      <div class="meta">ID: ${userID}</div>
    `;
    top.appendChild(avatar);
    top.appendChild(topInfo);

    const skillList = document.createElement("ul");
    skillList.className = "skills";
    (skills || []).forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      skillList.appendChild(li);
    });

    const bioP = document.createElement("p");
    bioP.className = "bio";
    bioP.textContent = bio;

    const contact = document.createElement("div");
    contact.className = "contact";
    if (email) contact.innerHTML += `<span><i class="fa-regular fa-envelope"></i> ${email}</span>`;
    if (phone) contact.innerHTML += `<span><i class="fa-solid fa-phone"></i> ${phone}</span>`;

    card.appendChild(top);
    card.appendChild(document.createElement("hr"));
    card.appendChild(skillList);
    card.appendChild(bioP);
    card.appendChild(contact);

    return card;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const manager = new DevCardManager();
  manager.init();
});
