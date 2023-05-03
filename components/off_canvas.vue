<script>
export default {
  name: 'OffCanvas',
  props: ['cart'],
  data() {
    return {
      canvas_cart: [],
      qtd: 0,
      user: null,
      message: null,
    }
  },
  computed: {
    total() {
      let total = 0

      this.cart.forEach((element) => {
        total += parseFloat(element.price * element.qtd)
      })

      return total.toFixed(2)
    },
  },
  mounted() {
    this.LoadUser()
  },
  methods: {
    removeItem(id) {
      this.canvas_cart = this.cart
      this.canvas_cart.splice(id, 1)
      localStorage.setItem('cart', JSON.stringify(this.canvas_cart))
    },
    updateValue(element, index) {
      const obj = document.querySelector(element).value
      this.canvas_cart = this.cart

      const item = {
        id: this.canvas_cart[index].id,
        name: this.canvas_cart[index].name,
        image: this.canvas_cart[index].image,
        price: this.canvas_cart[index].price,
        perishable: this.canvas_cart[index].perishable,
        created_at: this.canvas_cart[index].created_at,
        qtd: obj,
      }

      this.canvas_cart[index] = item
      console.log(this.canvas_cart)
      localStorage.setItem('cart', JSON.stringify(this.canvas_cart))
    },
    async LoadUser() {
      const token = localStorage.getItem('token')
      const url = 'http://127.0.0.1:8000/api/user'

      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then((response) => {
          this.user = response.id
        })
    },
    async SendData() {
      const body = JSON.parse(localStorage.getItem('cart'))

      if (body.length > 0) {
        document.querySelector(
          '#button',
        ).innerHTML = `<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`
        document.querySelector('#button').disabled = true
        const token = localStorage.getItem('token')
        const pass = 'laravel'

        body[0].id_user = this.user
        body[0].total = this.total

        fetch(`http://127.0.0.1:8000/api/${pass}/orders`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        })
          .then(response => response.json())
          .then((response) => {
            this.message = response.message
            if (response.status === 201) {
              localStorage.setItem('cart', JSON.stringify([]))
              this.$router.push('/profile')
            }
            else {
              document.querySelector('#button').disabled = false
              document.querySelector('#button').innerHTML = 'Salvar pedido'
              localStorage.setItem('cart', JSON.stringify([]))
              this.canvas_cart = []
            }

            setTimeout(() => {
              this.message = null
            }, 2000)
          })
      }
      else {
        this.message = 'O carrinho deve conter items para continuar!'

        setTimeout(() => {
          this.message = null
        }, 2000)
      }
    },
  },
}
</script>

<template>
  <div
    id="offcanvasExample"
    class="offcanvas offcanvas-end"
    tabindex="-1"
    aria-labelledby="offcanvasExampleLabel"
  >
    <div class="offcanvas-header">
      <h5 id="offcanvasExampleLabel" class="offcanvas-title">
        Carrinho ({{ cart.length }})
      </h5>
      <span class="text-red-600">{{ message }}</span>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      />
    </div>
    <div class="offcanvas-body">
      <table class="w-full max-w-full mb-4 bg-transparent">
        <thead>
          <tr>
            <th scope="col">
              #
            </th>
            <th scope="col">
              Produto
            </th>
            <th scope="col">
              Valor Uni.
            </th>
            <th scope="col">
              Quantidade
            </th>
            <th scope="col">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cart" :key="item.id">
            <th scope="row">
              {{ index }}
            </th>
            <td>{{ item.name }}</td>
            <td>R${{ item.price }}</td>
            <td>
              <input
                :id="`input${item.id}`"
                type="number"
                :value="item.qtd"
                class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded"
                @input="updateValue(`#input${item.id}`, index)"
              >
            </td>
            <td>
              <button class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-red-600 text-white hover:bg-red-700" @click="removeItem(index)">
                X
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <hr>
      <h3>Total: R${{ total }}</h3>
      <hr>
      <button id="button" class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-green-500 text-white hover:green-600 w-full" @click="SendData">
        Salvar pedido
      </button>
    </div>
  </div>
</template>

<style>
.offcanvas {
  width: 50%;
}

@media (max-width: 768px) {
  .offcanvas {
    width: 100%;
  }
}
</style>
