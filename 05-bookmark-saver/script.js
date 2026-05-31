const form = document.querySelector(".bookmark-form");
const addBookmark = document.querySelector(".add-bookmark");
const bmkList = document.querySelector(".bookmarked-list");

let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

document.addEventListener("DOMContentLoaded", loadBookmark);

function removeBookmark(name, url, liDiv) {
  bookmarks = bookmarks.filter(
    (bookmark) => bookmark.name !== name || bookmark.url !== url,
  );
  liDiv.remove();
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function createBookmark(name, url) {
  const liDiv = document.createElement("div");
  const li = document.createElement("li");
  const aTag = document.createElement("a");
  const rmvBtn = document.createElement("button");

  aTag.setAttribute("href", url);
  aTag.setAttribute("target", "_blank");
  aTag.textContent = name;
  rmvBtn.textContent = "remove";
  rmvBtn.classList.add("rmv-btn");
  liDiv.classList.add("list-div");

  li.appendChild(aTag);
  liDiv.appendChild(li);
  liDiv.appendChild(rmvBtn);

  rmvBtn.addEventListener("click", () => removeBookmark(name, url, liDiv));

  return liDiv;
}

function saveBookmark(name, url) {
  bookmarks.push({ name, url });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function loadBookmark() {
  bookmarks.forEach((bookmark) => {
    const liDiv = createBookmark(bookmark.name, bookmark.url);
    bmkList.appendChild(liDiv);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  // console.log("Form submitted");

  let name = document.getElementById("name").value.trim();
  let url = document.getElementById("url").value.trim();

  if (!name || !url) {
    alert("Please enter both name and URL.");
    return;
  } else if (!url.startsWith("https://") && !url.startsWith("http://")) {
    alert("Please enter a valid URL starting with http:// or https://");
    return;
  }

  let list = createBookmark(name, url);

  bmkList.prepend(list);
  saveBookmark(name, url);

  document.getElementById("name").value = "";
  document.getElementById("url").value = "";
});
