    let urlAPI = `https://api.github.com/search/repositories?q=`;
    let body = document.getElementById("body");

    let debounce = function (func, delay = 1000) {
        let inDebounce;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce);
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        };
    };

    class Model {
        constructor() {
            this.users = [];
        }

        async fetchRepositories(query) {
            try {
                const response = await fetch(`${urlAPI}${query}`, {
                    method: "GET",
                    headers: {
                        "X-GitHub-Api-Version": "2022-11-28",
                    },
                });
                const result = await response.json();
                this.users = result.items.slice(0, 5);
                return this.users;
            } catch (err) {
                console.error(err);
                return [];
            }
        }
    }


class View {
    constructor() {
        this.input = document.getElementById('input');
        this.load = document.getElementById('loader');
        this.list = document.getElementById('suggest');
        this.body = document.getElementById('body');
    }

    clearSuggestions() {
        while (this.list.firstChild) {
            this.list.removeChild(this.list.firstChild);
        }
        this.hideSuggestions();
    }

    showLoader() {
        this.load.classList.remove("close");
       
    }

    hideLoader() {
        this.load.classList.add("close");
    }

    showSuggestions(users) {
        this.clearSuggestions();
        this.list.classList.remove("close");
        users.forEach((user, index) => {
            const usersList = document.createElement("div");
            usersList.innerHTML = `<p data-action="add" class='suggest_form' data-index='${index}'>${user.full_name}</p>`;
            this.list.appendChild(usersList);
        });
    }

    hideSuggestions() {
        this.list.classList.add("close"); 
    }

    getInputValue() {
        return this.input.value;
    }

    clearInput() {
        this.input.value = '';
    }

    appendUserToList(user) {
        const userDiv = document.createElement('div');
        userDiv.className = 'suggest_list';
        let userInner = `
            <div>
                <h3>${user.full_name}</h3>
                <h4>${user.name || 'No name'}</h4>
                <div>
                    <svg aria-label="stars" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star">
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
                    </svg>
                    ${user.stargazers_count}
                </div>
            </div>
            <div data-action='close'>
            </div>
        `;

        userDiv.innerHTML = userInner

        this.body.appendChild(userDiv);
        userDiv.querySelector('[data-action="close"]').addEventListener('click', () => {
            this.body.removeChild(userDiv);
        })
    }
}




class Presenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.input.addEventListener(
            "input",
            debounce(this.onSearch.bind(this), 1000)
        );
        this.view.list.addEventListener('click', this.onUserSelect.bind(this));
    }

    async onSearch() {
        const query = this.view.getInputValue();
        if (query !== "") {
           

            try {

                this.view.showLoader()
                const users = await this.model.fetchRepositories(query);
                this.view.hideLoader();
                this.view.showSuggestions(users);
            } catch (error) {
                console.log(error.name, error.message)
                this.view.hideLoader();
            }
            
        } else {
            this.view.hideLoader();
            this.view.clearSuggestions();
        }
    }

    onUserSelect(event) {
        const action = event.target.dataset.action;
        const index = event.target.dataset.index;

        if (action === "add" && index !== undefined) {
            const selectedUser = this.model.users[index];
            this.view.appendUserToList(selectedUser);
            this.view.hideSuggestions();
            this.view.clearInput();
        } else if (action === "close") {
            this.view.clearSuggestions();
        }
    }
}





    const app = new Presenter(new Model(), new View());
