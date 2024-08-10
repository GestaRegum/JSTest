const form = document.getElementById("form");
const input = document.getElementById("input");
const usersList = document.querySelector(".addForList");
const list = document.querySelector(".suggest");
const load = document.querySelector(".loader");
let div = document.createElement("div");
let diva
let addList;
let url;
let users;
let debounce = function (func) {
    let inDebounce;
    return function () {
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(this, arguments), 1000);
    };
};


class Form {
    constructor(elem) {
    elem.onclick = this.onClick.bind(this)
    }


    add() {
        list.classList.add("close");
        input.value = "";
        diva = document.createElement("div")
        diva.className = 'suggest_list'
        diva.innerHTML = `
                                                <div>
                                                <h3>${users[event.target.classList[1]].full_name}</h3>
                                                <h4>${users[event.target.classList[1]].name}</h4>
                                                <div>
                                                <svg aria-label="stars" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star">
                                                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
                                                
                                                </svg>
                                                ${users[event.target.classList[1]].stargazers_count}
                                                </div>
                                               
                                                </div>

                                                <svg data-action='close' class="x" width="128" height="128" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.11 2.697L2.698 4.11 6.586 8l-3.89 3.89 1.415 1.413L8 9.414l3.89 3.89 1.413-1.415L9.414 8l3.89-3.89-1.415-1.413L8 6.586l-3.89-3.89z" fill="#000"></path>
                                                </svg>
                                            
                                            `;


        usersList.appendChild(diva)                            
    }

    close() {

        usersList.childNodes[1].outerHTML = ""
    }


 onClick(event) {
      let action = event.target.dataset.action;
      if (action) {
        this[action]()
      }
      }


}

new Form(body)






input.addEventListener(
    "input",
    debounce(async function (event) {
        div.innerHTML = ""
        try {
            if (event.target.value !== "") {
                
                load.classList.remove("close");
                list.classList.remove("close");

                url = `https://api.github.com/search/repositories?q=${event.target.value}`;

                let response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "X-GitHub-Api-Version": "2022-11-28",
                    },
                });

                let result = await response.json();
                  users = result.items.reduce((acc, cur, index) => {
                    if (index < 5) {
                        acc.push(cur);
                    }
                    return acc;
                }, []);
                    


                    for (let i = 0; i < 5; i++) {
                    console.log(users[i].full_name)
                    div.innerHTML += `<p data-action="add" class='suggest_form ${i}'>${users[i].full_name}</p>`;
                    list.appendChild(div);
                }


                load.classList.add("close");
                addList = document.querySelectorAll(".suggest_form");
               
            } else list.classList.add("close");
        } catch (er) {
            console.log(er.name, er.message);
        }
    }, 1000)
);