const addLinkEl = document.querySelector("#addLink");
const addSectionEl = document.querySelector(".add_section");
const readMoreSectionEl = document.querySelector(".read_more_section");
const readMoreEl = document.querySelector(".read_more");
const postsEl = document.querySelector(".posts");
const formEl = document.querySelector("form");
const toast = document.querySelector(".toast");

// Show Section
addLinkEl.addEventListener("click", () => {
    addSectionEl.classList.add("show");
});
postsEl.addEventListener("click", (event) => {
    if(event.target.className === "readMoreBtn"){
        const postId = event.target.id;
        const posts = JSON.parse(localStorage.getItem("posts"));

        const selectedPost = posts.find(p => p.id === postId);

        readMoreEl.innerHTML = `
            <div class="flex_between_center mb-2">
                <h2>${selectedPost.title}</h2>
                <span class="author">${selectedPost.author}</span>
            </div>

            <p>${selectedPost.content}</p>

            <div class="flex_between_center mt-2">
                <div class="btn_group">
                    <button class="editBtn mr">Edit</button>
                    <button class="deleteBtn" data-id="${selectedPost.id}">Delete</button>
                </div>

                <small class="date">${new Date(+selectedPost.id).toDateString()}</small>
            </div>

            <div class="closeBtn">X</div>
        `;

        readMoreSectionEl.classList.add("show");
    }
});

// Close Section
addSectionEl.addEventListener("click", (event) => {
    if(event.target.className === "closeBtn"){
        addSectionEl.classList.remove("show");
    }
});
readMoreSectionEl.addEventListener("click", (event) => {
    if(event.target.className === "closeBtn"){
        readMoreSectionEl.classList.remove("show");
    }
});

// Delete Section
readMoreEl.addEventListener("click", (event) => {
    // Delete functionality.
    if(event.target.className === "deleteBtn"){
        const postId = event.target.attributes["data-id"].value;
        const posts = JSON.parse(localStorage.getItem("posts"));
        const filteredPosts = posts.filter(post => post.id !== postId);
        localStorage.setItem("posts", JSON.stringify(filteredPosts));
        deletePost(postId);
        readMoreSectionEl.classList.remove("show");
        toast.innerHTML = "Post deleted.";
        toast.classList.remove("error");
        toast.classList.add("success");
        toast.classList.add("show");
        return setTimeout(() => {
            toast.classList.remove("show");
        }, 2000);
    }

    // Edit functionality
    if(event.target.className.indexOf("editBtn") > -1){
        toast.innerHTML = "Feature will be added soon.";
        toast.classList.remove("error");
        toast.classList.add("success");
        toast.classList.add("show");
        return setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }
});

const deletePost = (id) => {
    const readMoreBtns = document.querySelectorAll(".readMoreBtn");
    readMoreBtns.forEach(readMoreBtn => {
        if(readMoreBtn.id === id){
            postsEl.removeChild(readMoreBtn.parentElement.parentElement);
        }
    });
}

// Add Post Section
formEl.addEventListener("submit", (event) => {
    event.preventDefault();

    const author = formEl["postAuthor"].value;
    const title = formEl["postTitle"].value;
    const content = formEl["postContent"].value;

    if(!author || !author.length || !title ||
        !title.length || !content || !content.length
        ){
            toast.innerHTML = "All fields are required.";
            toast.classList.remove("success");
            toast.classList.add("error");
            toast.classList.add("show");
            return setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
    }

    const post = {
        id: String(new Date().getTime()),
        author,
        title,
        content
    }

    const posts = JSON.parse(localStorage.getItem("posts"));
    if(posts){
        localStorage.setItem("posts", JSON.stringify([
            ...posts,
            post
        ]));
    } else {
        localStorage.setItem("posts", JSON.stringify([ post ]));
    }

    toast.innerHTML = "Post added.";
    toast.classList.remove("error");
    toast.classList.add("success");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);

    // Add post to the DOM
    const divEl = document.createElement("div");
    divEl.setAttribute("class", "post");

    divEl.innerHTML = `
        <h2>${post.title}</h2>
        <hr>
        <p class="post_content">${post.content.length < 30 ? post.content : post.content.slice(0, 30) + "..."}</p>
        <div class="post_group">
            <button class="readMoreBtn" id="${post.id}">Read More</button>
            <small>${new Date(+post.id).toDateString()}</small>
        </div>
        `;
    postsEl.appendChild(divEl);
    
    addSectionEl.classList.remove("show");
    formEl.reset();
});

// Render posts
function renderPosts(){
    const posts = JSON.parse(localStorage.getItem("posts"));

    if(posts){
        const result = posts.map(post => {
            return (`
                <div class="post">
                    <h2>${post.title}</h2>
                    <hr>
                    <p class="post_content">${post.content.length < 30 ? post.content : post.content.slice(0, 30) + "..."}</p>
                    <div class="post_group">
                        <button class="readMoreBtn" id="${post.id}">Read More</button>
                        <small>${new Date(+post.id).toDateString()}</small>
                    </div>
                </div>
            `);
        });

        postsEl.innerHTML = result.join("");
    }
} 

// Render posts to the DOM
renderPosts();

// First time on using the application.
const posts = JSON.parse(localStorage.getItem("posts"));
if(!posts){
    setTimeout(() => {
        toast.innerHTML = `Click on "Add" post at the top right corner to add blog post.`;
        toast.classList.remove("error");
        toast.classList.add("success");
        toast.classList.add("show");
        return setTimeout(() => {
            toast.classList.remove("show");
        }, 6000);
    }, 2000);
}
