(function() {
    // const moment = require("moment");
    // Vue.component("first-component", {
    //     template: "#template",
    //     props: ["postTitle", "id"],
    //     // is called post-title in the index.html
    //     data: function() {
    //         return {
    //             name: "Nina",
    //             count: 0
    //         };
    //     },
    //     mounted: function() {
    //         console.log("component mounted:");
    //         console.log("my postTitle: ", this.postTitle);
    //         console.log("id: ", this.id);
    //     },
    //     methods: {
    //         closeModal: function() {
    //             console.log("sanity check click worked!");
    //             // emits an event called close:
    //             this.$emit("close", this.count);
    //         }
    //     }
    // });
    Vue.component("modal-component", {
        template: "#modal-template",
        props: ["id"],
        // is called post-title in the index.html
        data: function() {
            return {
                name: "Nina",
                count: 0,
                imageData: [],
                comment: "",
                username: "",
                comments: []
            };
        },
        mounted: function() {
            console.log("modal-component mounted:");
            console.log("image id: ", this.id);
            var vueComponent = this;
            axios
                .get("/image/" + this.id)
                .then(function(res) {
                    // console.log("res.data in script.js: ", res.data);
                    vueComponent.imageData = res.data;
                    axios
                        .get("./comments/" + vueComponent.id)
                        .then(function(res) {
                            console.log('res.data: ', res.data);
                            vueComponent.comments = res.data;
                            var timeStamps =  document.getElementsByClassName('date-time');
                            console.log('timeStamps.length: ', timeStamps.length);
                            for (var i = 0; i < timeStamps.length; i++) {
                                console.log('timeStamps[i].innerHTML: ', timeStamps[i].innerHTML);
                                var formattedDate = moment(timeStamps[i].innerHTML).format('YYYY-MM-DD hh:mm a');
                                console.log('formattedDate: ', formattedDate);
                                timeStamps[i].innerHTML = formattedDate;
                            }
                        })
                        .catch(function(err) {
                            console.log(
                                "err in mounted in GET comments/id:",
                                err
                            );
                        });
                })
                .catch(function(err) {
                    console.log("err in POST /comments/:", err);
                });
        },
        methods: {
            handleClick: function(e) {
                // to make the button do not refresh the page:
                e.preventDefault();

                var commentData = {
                    comment: this.comment,
                    username: this.username
                };
                var vueInstance = this;
                axios
                    .post("./comment/" + this.id, commentData)
                    .then(function(res) {
                        console.log(
                            "response from POST /comment/:id: ",
                            res.data[0]
                        );
                        vueInstance.comments.unshift(res.data[0]);
                    })
                    .catch(function(err) {
                        console.log("err in POST /comment/:id: ", err);
                    });
            },
            closeModal: function() {
                console.log("sanity check click worked!");
                // emits an event called close:
                this.$emit("close", this.count);
            }
        }
    });
    
    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            selectedImage: null
            // selectedFruit: null,
            // fruits: [
            //     {
            //         title: "🥝",
            //         id: 1
            //     },
            //     {
            //         title: "🍓",
            //         id: 2
            //     },
            //     {
            //         title: "🍋",
            //         id: 3
            //     }
            // ]
        },
        created: function() {
            // console.log("created");
        },
        mounted: function() {
            // console.log("mounted");
            var vueInstance = this;
            axios
                .get("/images")
                .then(function(res) {
                    // console.log('res.data in script.js: ', res.data);
                    vueInstance.images = res.data;
                })
                .catch(function(err) {
                    console.log("err in mounted():", err);
                });
        },
        methods: {
            closeMe: function(count) {
                console.log("i need to close the modal", count);
                // in here we can update the value of selectedFruit
                // this.selectedFruit = null;
                this.selectedImage = null;
            },
            handleClick: function(e) {
                // to make the button do not refresh the page:
                e.preventDefault();
                // 'this' allows me to say all the properties of data:
                // console.log('this: ', this);
                // formData to send file to the server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                // will only log an empty object, but the data is actually in there:
                // console.log('formData: ', formData);
                var vueInstance = this;
                axios
                    .post("./upload", formData)
                    .then(function(res) {
                        // console.log('response from POST /upload: ', res.data[0]);
                        vueInstance.images.unshift(res.data[0]);
                    })
                    .catch(function(err) {
                        console.log("err in POST /upload: ", err);
                    });
            },
            handleChange: function(e) {
                console.log("handleChange is running");
                // file that we just uploaded:
                console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
            }
        },
        updated: function() {
            // console.log("updated");
        }
    });
})();
