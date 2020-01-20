(function() {
    new Vue({
        el: '#main',
        data: {
            heading: 'I need sleep',
            greetee: 'Mr. Sloth',
            className: 'tired',
            url: 'https://www.sleepfoundation.org/articles/what-happens-when-you-sleep',
            candy: [
                {name: 'maltesers'},
                {name: 'happy cherries'},
                {name: 'milka'}
            ]
        },
        created: function() {
            console.log('created');
        },
        mounted: function() {
            console.log('mounted');
            var vueInstance = this;
            axios.get('/candy').then(function(res){
                console.log(res.data);
                vueInstance.candy = res.data;
            }).catch(function(err) {
                console.log('err in mounted():', err);
            });
        },
        updated: function() {
            console.log('updated', this.greetee);
        },
        methods: {
            sayHello: function() {
                console.log('hello, ' + this.greetee);
            },
            changeName: function(name) {
                console.log('changing..', name);
                for (var i = 0; i < this.candy.length; i++) {
                    if (this.candy[i].name == name) {
                        this.candy[i].name = 'baci';
                    }
                }
                this.sayHello();
            }
        }
    });
}());
