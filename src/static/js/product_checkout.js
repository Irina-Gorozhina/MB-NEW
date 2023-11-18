const price = document.querySelector('#price');
const count = document.querySelector('.count');
const total = document.querySelector('.total');
const countMobile = document.querySelector('.count-mobile');
const totalMobile = document.querySelector('.total-mobile');

function changeTotal (e)  {
    if (+e.target.value <= 0) {
        total.value = 0;
        totalMobile.value = 0;
        count.value = 0;
        countMobile.value = 0;
    } else {
        total.value = +price.value * +e.target.value;
        totalMobile.value = +price.value * +e.target.value;
    }
}
count.addEventListener('change', changeTotal)
countMobile.addEventListener('change', changeTotal)

