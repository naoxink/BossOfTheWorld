const app = new Vue({
  'el': '#app',

  'data': {
    'version': '0.0.1',
    'importancia': 0,
    'importanciaPorClick': 1,
    'mejoras': {
      'emails': {
        'nombre': 'Email',
        'coste': 10,
        'incremento': 1.3,
        'total': 0,
        'incrementoImportanciaPorClick': 1,
        'incrementoImportanciaPorTick': 1,
        'visible': false
      },
      'emailsCoord': {
        'nombre': 'Email de coordinación',
        'coste': 50,
        'incremento': 1.3,
        'total': 0,
        'incrementoImportanciaPorClick': 3,
        'visible': false
      },
      'llamadasTlf': {
        'nombre': 'Llamada de teléfono',
        'coste': 150,
        'incremento': 1.3,
        'total': 0,
        'incrementoImportanciaPorClick': 7,
        'visible': false
      },
      'TlfEmpresa': {
        'nombre': 'Teléfono de empresa',
        'coste': 500,
        'incremento': 1.3,
        'total': 0,
        'incrementoImportanciaPorClick': 10,
        'visible': false
      },
      'EquipoCargo': {
        'nombre': 'Equipo a cargo',
        'coste': 1500,
        'incremento': 1.3,
        'total': 0,
        'incrementoImportanciaPorClick': 15,
        'incrementoImportanciaPorTick': 10,
        'visible': false
      },
      'IdeaJefe': {
        'nombre': 'Dar idea al Jefe',
        'coste': 3000,
        'incremento': 1.3,
        'total': 0,
        'incrementoImportanciaPorClick': 20,
        'visible': false
      },
      'ConsejosJefe': {
        'nombre': 'Dar consejo al Jefe',
        'coste': 5000,
        'incremento': 1.3,
        'total': 0,
        'incrementoImportanciaPorClick': 30,
        'visible': false
      },
      'empresas': {
        'nombre': 'Comprar empresa',
        'coste': 50000,
        'incremento': 2.3,
        'total': 0,
        'incrementoImportanciaPorClick': 100,
        'visible': false
      },
    },
    'timers': {
      'autoImportancia': null
    },
    'mostrandoAlgunaMejora': false
  },

  'methods': {
    'trabajar': function(){
      this.importancia += this.importanciaPorClick
    },
    'trabajarAuto': function(){
      this.importancia += this.calcularImportanciaPorTick()
    },
    'calcularImportanciaPorTick': function(){
      let importancia = 1
      return importancia
    },
    'puedeComprar': function(id, cantidad = 1){
      return this.importancia >= this.mejoras[id].coste * cantidad
    },
    'iniciarTimerEquipo': function(){
      let _this = this
      this.timers.autoImportancia = new Timer({ 'onTick': _this.trabajarAuto })
    },
    'comprarMejora': function(id, cantidad = 1){
      if(!this.puedeComprar(id, cantidad)) return false
      if(id === 'EquipoCargo'){
        if(this.mejoras[id].total === 0){
          this.iniciarTimerEquipo()
        }
      }
      this.importancia -= this.mejoras[id].coste * cantidad
      this.mejoras[id].total += cantidad
      this.mejoras[id].coste *= this.mejoras[id].incremento * cantidad
      this.importanciaPorClick += this.mejoras[id].incrementoImportanciaPorClick * cantidad
      if(this.mejoras[id].incrementoImportanciaPorTick){
        this.incrementoImportanciaPorTick += this.mejoras[id].incrementoImportanciaPorTick
      }
    },
    'estaCerca': function(id){
      if(this.mejoras[id].total === 0 && this.mejoras[id].coste < this.importancia + (this.mejoras[id].coste / 3)){
        this.mejoras[id].visible = true
        if(!this.mostrandoAlgunaMejora) this.mostrandoAlgunaMejora = true
      }
      return this.mejoras[id].visible
    },
    'calcularPreciosIniciales': function(){
      this.importancia = 0
      this.importanciaPorClick = 1
      this.mostrandoAlgunaMejora = false
      this.timers.autoImportancia = null
      let costeAnterior = null
      let index = 0
      for(let id in this.mejoras){
        if(costeAnterior === null){
          costeAnterior = this.mejoras[id].coste
        }else{
          this.mejoras[id].coste = costeAnterior * (index + Object.keys(this.mejoras).length)
          costeAnterior = this.mejoras[id].coste
        }
        this.mejoras[id].total = 0
        this.mejoras[id].visible = false
        index++
      }
    },
    'tieneMejora': function(id){
      return this.mejoras[id].total > 0
    },
    'formatearNumero': function(n){
      return n.toLocaleString()
    },
    'guardar': function(){
      let datos = { }
      datos.version = this.version
      datos.importancia = this.importancia
      datos.importanciaPorClick = this.importanciaPorClick
      datos.mejoras = this.mejoras
      datos.mostrandoAlgunaMejora = this.mostrandoAlgunaMejora
      localStorage.setItem(`BOTWv${datos.version}`, JSON.stringify(datos))
    },
    'cargar': function(){
      let datos = localStorage.getItem(`BOTWv${this.version}`)
      if(!datos) return this.calcularPreciosIniciales()
      datos = JSON.parse(datos)
      this.importancia = datos.importancia
      this.importanciaPorClick = datos.importanciaPorClick
      this.mejoras = datos.mejoras
      this.mostrandoAlgunaMejora = datos.mostrandoAlgunaMejora
      if(this.tieneMejora('EquipoCargo')) this.iniciarTimerEquipo()
    },
    'reiniciar': function(){
      if(!confirm('Se BORRARÁN TODOS los datos ¿Quieres continuar?')) return false
      this.mejoras['emails'].coste = 10
      this.calcularPreciosIniciales()
      this.guardar()
    }
  },

  'mounted': function(){
    this.cargar()
  }
})