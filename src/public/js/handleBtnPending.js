document.addEventListener('DOMContentLoaded', function() {
    var btnConfirm = document.querySelectorAll('.btn-confirm')
    var btnSuccess = document.querySelectorAll('.btn-success')
    console.log(btnConfirm)
    console.log(btnSuccess)

    btnConfirm.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const idC = btn.relatedTarget.getAttribute('data-id')
        const tr = document.querySelector(`tr[data-id="${idC}"]`)
        console.log(1)
        console.log(tr)
      })
    })
  })