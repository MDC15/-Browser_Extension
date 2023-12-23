(function (window) {
  "use strict";

  class Store {
    constructor(name) {
      let isSupported;
      try {
        window.localStorage.setItem("test", "test");
        window.localStorage.removeItem("test");
        isSupported = true;
      } catch (e) {
        isSupported = false;
      }
      this.name = name;
      this.isSupported = isSupported;
    }

    save(items) {
      const json = JSON.stringify(items);
      window.localStorage.setItem(this.name, json);
    }

    load() {
      const items = window.localStorage.getItem(this.name);
      return items && items.length ? JSON.parse(items) : [];
    }
  }

  window.Store = Store;
})(window);

(function (window, Store) {
  "use strict";

  class State {
    constructor(name) {
      this.itemId = 1;
      this.date = this.setDate();
      this.form = {
        focus: false,
        valid: false,
      };
      this.items = [];
      this.store = new Store(name);
      if (this.store.isSupported) {
        this.items = this.store.load();
      }
      if (this.items.length) {
        for (const item of this.items) {
          if (item.id >= this.itemId) {
            this.itemId = item.id + 1;
          }
        }
      }
      this.orderItems();
    }

    saveItems() {
      if (this.store.isSupported) {
        this.store.save(this.items);
      }
    }

    addItem(item) {
      this.items.unshift({
        id: this.itemId++,
        status: 0,
        value: item,
      });
      this.saveItems();
    }

    orderItems() {
      const todo = this.items.filter((item) => {
        return item.status === 0;
      });
      const done = this.items.filter((item) => {
        return item.status === 1;
      });
      this.items = todo.concat(done);
    }

    findItemIndex(id) {
      return this.items.findIndex((item) => {
        return item.id === id;
      });
    }

    deleteItem(id) {
      const itemIndex = this.findItemIndex(id);
      this.items.splice(itemIndex, 1);
      this.saveItems();
    }

    toggleItemStatus(id) {
      const itemIndex = this.findItemIndex(id);
      this.items[itemIndex].status = this.items[itemIndex].status ? 0 : 1;
      this.orderItems();
      this.saveItems();
    }

    setDate() {
      const date = new Date();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let day = date.getDate();
      let monthIndex = date.getMonth();
      let year = date.getFullYear();
      return day + " " + monthNames[monthIndex] + " " + year;
    }
  }

  window.State = State;
})(window, window.Store);

(function (State) {
  "use strict";

  class App {
    constructor(name) {
      this.name = name;
      this.state = new State(name);
      this.date = document.querySelector("h2");
      this.list = document.querySelector("ul");
      this.button = document.querySelector("button");
      this.form = document.querySelector("form");
      this.input = document.querySelector("input");
      this.bindEvents();
      this.render();
    }

    bindEvents() {
      this.list.addEventListener("click", this.handleClick.bind(this));
      this.form.addEventListener("submit", this.submitForm.bind(this));
      this.input.addEventListener("keyup", this.keyUp.bind(this));
      this.input.addEventListener("focus", this.focus.bind(this));
      this.input.addEventListener("blur", this.blur.bind(this));
      this.button.addEventListener("focus", this.focus.bind(this));
      this.button.addEventListener("blur", this.blur.bind(this));
    }

    submitForm(event) {
      event.preventDefault();
      if (!this.input.value.length) {
        return;
      }
      this.state.addItem(this.input.value);
      this.input.value = "";
      this.render();
    }

    handleClick(event) {
      const e = event;
      if (e && e.target) {
        const element = e.target.type;
        if (element == "submit" || element == "checkbox") {
          const id = parseInt(e.target.parentNode.getAttribute("data-id"));
          if (element == "submit") {
            this.state.deleteItem(id);
          } else {
            this.state.toggleItemStatus(id);
          }
        }
      }
      this.render();
    }

    render() {
      let listHTML = "";
      for (const item of this.state.items) {
        const className = item.status ? "done" : "";
        listHTML += '<li class="' + className + '" data-id="' + item.id + '">';
        listHTML +=
          '<input type="checkbox"' + (item.status ? " checked" : "") + ">";
        listHTML += item.value + "<button>x</button></li>";
      }

      this.date.innerHTML = this.state.date;
      this.form.classList.toggle("focus", this.state.form.focus);
      this.form.classList.toggle("valid", this.state.form.valid);
      this.list.innerHTML = listHTML;
    }

    keyUp() {
      this.state.form.valid = this.input.value.length ? 1 : 0;
      this.render();
    }

    blur() {
      this.state.form.focus = 0;
      this.render();
    }

    focus() {
      this.state.form.focus = 1;
      this.render();
    }
  }

  const app = new App("todo-list-state-example");
})(window.State);
