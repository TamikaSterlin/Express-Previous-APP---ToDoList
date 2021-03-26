 // build a todo list with an 'addbutton' 'deleteallbutton' 'clearcompletedbutton' and and input area
 //when user types an item in the input area and clicks add, the item should appear in the 'li' area
 //when user clicks on one of the 'li' items it should strike through to mark as completedItems
 //then when use clicks 'trashcan' all completed items should delete
 // and if use clicks reset button then all items true or false should delete aka reset

 //mentor mark helped me with "items left to Complete"


 const taskItem = document.querySelectorAll('.taskItem')
 document.querySelector('.fas.fa-plus-circle').addEventListener('click', addItem)
 document.querySelector('#trash').addEventListener('click', deleteCompItems)
 document.querySelector('.fas.fa-redo').addEventListener('click', reset)
 const leftElement = document.getElementById('leftToComplete')

 if (taskItem.length > 0)
   taskItem.forEach(item => item.addEventListener('click', markCompleted));

 function addItem() {
   let liItem = document.createElement('li')
   let input = document.querySelector('#toDo').value
   let text = document.createTextNode(input)
   liItem.appendChild(text)
   liItem.addEventListener('click', markCompleted)
   document.querySelector("#list").appendChild(liItem);
   document.getElementById("toDo").value = "";
   fetch('tasks', {
       method: 'post',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         'task': input
       })
     })
     .then(function(response) {
       window.location.reload()
     })

   let left = leftElement.innerText
   left = parseInt(left) + 1
   leftElement.innerText = left
   console.log(left);
 }

 function reset() {
   fetch('tasks', {
       method: 'delete',
       headers: {
         'Content-Type': 'application/json'
       }
     })
     .then(res => {
       if (res.ok) {
         return res.json()
       }
     })
     .then(window.location.reload())
 }



 function markCompleted(click) {
   console.log(click.currentTarget.innerText);
   // click.currentTarget.classList.toggle('done')
   fetch('tasks', {
     method: 'put',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       'task': click.currentTarget.innerText,
       'completed': click.currentTarget.classList.contains('done')
     })
   }).then(function(){window.location.reload()})
 }



 function deleteCompItems() {
   // const complete = document.querySelectorAll('.done')
   // console.log(complete, 'completed items');
   // for (let i = 0; i < complete.length; i++) {
   //   console.log(i, complete[i]);
   //   complete[i].remove()
   // }
   // let left = leftElement.innerText
   // left = parseInt(left) - complete.length
   // leftElement.innerText = left
   fetch('tasksCompleted', {
       method: 'delete',
       headers: {
         'Content-Type': 'application/json'
       }
     })
     .then(res => {
       if (res.ok) {
         return res.json()
       }
     })
     .then(window.location.reload(''))
 }
