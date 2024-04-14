const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users'
const userList = []
const dataPanel = document.querySelector('#data-panel')
const LIST_PER_PAGE = 24
let filteredUser = []
const myModal = new bootstrap.Modal(document.querySelector('#Modal_1'), {
  keyboard: false
})
let favorlist = JSON.parse(localStorage.getItem('favoriteUser')) || []


//請求資料
axios.get(INDEX_URL)
  .then(function (response) {
    userList.push(...response.data.results)
    renderPaginator(userList.length)
    render(getListByPage(1))
  })
  .catch(function (error) {
    console.log(error)
  })

//列出每個CARD
function render(data) {
  let rowHtml = ''
  data.forEach(element => {

    rowHtml += `
    <div  class="card btn m-2" data-id="${element.id}" style="width: 10rem;">`


    if (favorlist.some((user) => user.id === element.id)) {
      rowHtml += `<i class="fa-solid fa-heart position-absolute top-0 end-0 mt-2 me-2 active" data-id="${element.id}"></i>`
    }
    else {
      rowHtml += `<i class="fa-solid fa-heart position-absolute top-0 end-0 mt-2 me-2" data-id="${element.id}"></i> `
    }

    rowHtml += `
  <img src="${element.avatar}" class="card-img-top" alt="avatar" data-id="${element.id}">
  <div class="card-body" data-id="${element.id}">
    <h5 class="card-title" data-id="${element.id}">${element.surname} ${element.name}</h5>
  </div>
</div>`
  })
  dataPanel.innerHTML = rowHtml
}


//請求並放入MODAL 詳細資料
function showModal(id) {
  const modalTitle = document.querySelector('.modal-title')
  const modalDescription = document.querySelector('.modalDescription')
  const modalImage = document.querySelector('#user_img')

  const data = userList.find(user => user.id === id)

  modalTitle.innerHTML = `${data.surname} ${data.name}`
  modalImage.src = `${data.avatar} `
  modalDescription.innerHTML = `
    <ul>
    <li> Gender : ${data.gender} </li>
    <li> Age : ${data.age} </li>
    <li> Birthday : ${data.birthday} </li>
    <li> Region : ${data.region} </li>
    <li> Email : ${data.email} </li>
    </ul>
   `

  myModal.show()
}
// 監聽 打開Modal
dataPanel.addEventListener("click", function onPanelClicked(event) {
  let target = event.target
  console.log(target)
  if (target.classList.contains('fa-heart')) {
    target.classList.toggle('active')
    if (target.classList.contains('active')) {
      addToFavorite(Number(target.dataset.id))
    } else {
      removeFavorite(Number(target.dataset.id))
    }

  } else {
    showModal(Number(target.dataset.id))
  }
})


//搜尋關鍵字
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

searchForm.addEventListener('input', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()


  filteredUser = userList.filter((user) => {
    let name = user.surname + user.name
    return name.toLowerCase().includes(keyword)
  })

  //錯誤處理：無符合條件的結果
  if (filteredUser.length === 0) {
    renderPaginator(0)
    return dataPanel.innerHTML = '<center><h1>not found</h1></center>'
  }
  //重新輸出至畫面
  else {
    render(getListByPage(1))
    renderPaginator(filteredUser.length)
  }
})



//顯示單頁內容
function getListByPage(page) {
  const data = filteredUser.length ? filteredUser : userList
  const startIndex = (page - 1) * LIST_PER_PAGE
  return data.slice(startIndex, startIndex + LIST_PER_PAGE)
}


//更改分頁顯示頁數
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / LIST_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  pagination.innerHTML = rawHTML
}

const pagination = document.querySelector('.pagination')
// 監聽 pagination
pagination.addEventListener("click", (event) => {
  console.log(event.target.dataset.page)
  let page = Number(event.target.dataset.page)
  render(getListByPage(page))

})

//加入收藏
function addToFavorite(id) {

  let user = userList.find((user) => user.id === id)
  if (favorlist.some((user) => user.id === id)) {
    return alert('此用戶已經在收藏清單中！')
  }
  favorlist.push(user)
  localStorage.setItem('favoriteUser', JSON.stringify(favorlist))
}


//移除收藏清單 

function removeFavorite(id) {
  favorlist = favorlist.filter((user) => user.id !== id)
  // 更新本地存储中的收藏清单
  localStorage.setItem('favoriteUser', JSON.stringify(favorlist))


}

// //確認愛心狀態
// function checkLove() {

//   let user = userList.find((user) => user.id === id)
//   if (favorlist.some((user) => user.id === id)) {
//     return alert('此用戶已經在收藏清單中！')
//   }
//   favorlist.push(user)
//   localStorage.setItem('favoriteUser', JSON.stringify(favorlist))
// }
