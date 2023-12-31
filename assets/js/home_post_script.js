let createPost = () => {
  let newPostForm = $("#new-post-form");
  newPostForm.submit(function (e) {
    e.preventDefault(); //stopping default behaviour so ajax will post the form data in JSON
    $.ajax({
      url: "/post/createPost",
      type: "POST",
      data: newPostForm.serialize(), //serize will convert data into json
      success: function (data) {
        let newPost = newPostDom(data.data.post);
        let postDate = data.data.post.createdAt;
        $("#post-list-container>ul").prepend(newPost);
        new PostComments(data.data.post._id);
        new ToggleLike($(" .toggle-like-button", newPost));
        deletePost($(" .delete-post-button", newPost));
        document.myform.content.value = "";
        new Noty({
          layout: "topRight",
          theme: "metroui",
          type: "success",
          text: "Published new post !!!",
          timeout: 1500,
        }).show();
      },
      error: function (error) {
        console.log(error.responseText);
        new Noty({
          layout: "topRight",
          theme: "metroui",
          type: "error",
          text: "Error Occured while publishing a post !!!",
          timeout: 1500,
        }).show();
      },
    });
  });
  let newPostDom = function (post) {
    return $(`
    <li id="post-${post._id}" class="mb-1">
  <div class="card">
    <div class="card-header bg-white">
      <div class="row">
        <div class="col-2 col-md-1">
          <img
            class="m-1 border border-1 border-black rounded"
            src="${post.user.avatar}"
            style="max-width: 40px; max-height: 40px;min-height: 40px;font-size:7px;"
            alt="${post.user.name}"
          />
        </div>
        <div class="col-10 col-md-11 text-start">
          <blockquote class="blockquote mb-0">
            <p class="text-primary">${post.user.name}</p>
            <footer class="blockquote-footer">
              <cite title="Source Title" class="fs-6"
                >${post.createdAt}
              </cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
    <div class="card-body">
      <p class="card-text">${post.content}</p>
    </div>
    <div class="card-footer bg-white">
      <div class="mb-1 d-flex grid g-1">

        <a class="delete-post-button" href="/post/deletePost/${post._id}">
          <img src="/img/delete.svg" class="text-primary"
        /></a>

        <a
          class="toggle-like-button text-decoration-none"
          data-likes="${post.likes.length}"
          href="/like/toggle/?id=${post._id}&type=post"
        >
          <img src="/img/like.svg" />

          <!-- <i class="bi bi-hand-thumbs-up text-primary fa-lg"></i> -->
          <sup class="text-danger"><b>${post.likes.length}</b></sup>
        </a>
        <a
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample-${post._id}"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          <img src="/img/comment.svg" />
        </a>
      </div>
      <div class="collapse" id="collapseExample-${post._id}">
        <div class="card card-body border border-0 p-0 bg-light">
          <!-- Comment Section -->
          <div class="post-comments my-1">
            <form
              id="post-${post._id}-comments-form"
              action="/comment/createComment"
              method="post"
              name="post-${post._id}-comments-form"
              class="d-flex"
            >
              <div class="form-floating col-md-10">
                <textarea
                  name="content"
                  class="form-control"
                  placeholder="Leave a comment here"
                  id="post-${post._id}-comments-formTextarea"
                ></textarea>
                <label for="post-${post._id}-comments-formTextarea"
                  >Write a comment :)</label
                >
              </div>
              <input type="hidden" name="post" value="${post._id}" />
              <button type="submit" class="btn btn-primary col-md-2">
                Comment
              </button>
            </form>
          </div>
          <div class="post-comment-list">
            <ul
              id="post-comments-${post._id}"
              style="list-style-type: none; margin: 0px; padding: 0px"
              class="list-group"
            >
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</li>  
    `);
  };
};
let deletePost = function (deleteLink) {
  $(deleteLink).click(function (e) {
    e.preventDefault();
    $.ajax({
      type: "GET",
      url: $(deleteLink).prop("href"),
      success: function (data) {
        // console.log(data);
        $(`#post-${data.data.post_id}`).remove();
        new Noty({
          layout: "topRight",
          theme: "metroui",
          type: "success",
          text: "Post and its associated comments and likes deleted !!!",
          timeout: 1500,
        }).show();
      },
      error: function (error) {
        console.log("Error", error.responseText);
        new Noty({
          layout: "topRight",
          theme: "metroui",
          type: "error",
          text: "Error Occured while deleting post !!!",
          timeout: 1500,
        }).show();
      },
    });
  });
};
let convertPostToAjax = () => {
  $("#post-list-container>ul>li").each(function () {
    deletePost($(" .delete-post-button", $(this)));

    // get post id
    let postId = $(this).prop("id").split("-")[1];
    new PostComments(postId);
  });
};
createPost();
convertPostToAjax();
