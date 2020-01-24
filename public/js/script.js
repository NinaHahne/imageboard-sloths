(function() {
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
            this.loadModal();
        },
        watch: {
            id: function() {
                // in here we want to do exactly the same as we did in mounted
                // copy paste or find a way to not repeat yourself
                // the user tries to go to an image that doesn't exist
                // we probaly want to look at the response from the server
                // if the response is a certain thing... close the modal
                this.loadModal();
            }
        },
        methods: {
            loadModal: function() {
                console.log("modal-component mounted:");
                console.log("image id: ", this.id);
                var vueComponent = this;
                axios
                    .get("/image/" + this.id)
                    .then(function(res) {
                        console.log("res.data.length in GET /image/id: ", res.data.length);
                        if (res.data.length == 0) {
                            vueComponent.$emit("close");
                        }
                        // is res.data empty??
                        vueComponent.imageData = res.data;
                        axios
                            .get("./comments/" + vueComponent.id)
                            .then(function(res) {
                                // console.log('res.data: ', res.data);
                                vueComponent.comments = res.data;
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
                            res.data
                        );
                        vueInstance.comments.unshift(res.data);
                    })
                    .catch(function(err) {
                        console.log("err in POST /comment/:id: ", err);
                    });
            },
            closeModal: function() {
                // console.log("sanity check click worked!");
                // emits an event called close:
                this.$emit("close", this.count);

                location.hash = '';
                // or (to also delete the empty hash in the url):
                history.replaceState(null, null, ' ');
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
            selectedImage: location.hash.slice(1),
            showMoreButton: true
        },
        created: function() {
            // console.log("created");
        },
        mounted: function() {
            // console.log("mounted");
            var vueInstance = this;
            addEventListener('hashchange', function() {
                vueInstance.selectedImage = location.hash.slice(1);
            });
            axios
                .get("/images")
                .then(function(res) {
                    // console.log('res.data in script.js: ', res.data);
                    vueInstance.images = res.data;
                })
                .catch(function(err) {
                    console.log("err in GET /images:", err);
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
                // console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
            },
            showMore: function(e) {
                e.preventDefault();
                // find the id of the last shown image:
                var lowestId = this.images[this.images.length - 1].id;
                console.log('lowestId: ', lowestId);
                var vueInstance = this;
                axios
                    .get("/moreimages/" + lowestId)
                    .then(function(res) {
                        console.log('vueInstance.images.length: ', vueInstance.images.length);
                        console.log('res.data from GET /moreimages: ', res.data);
                        vueInstance.images = vueInstance.images.concat(res.data);
                    })
                    .catch(function(err) {
                        console.log("err in GET /moreimages:", err);
                    });
            }
        },
        updated: function() {
            console.log("updated");
            var vueInstance = this;
            axios
                .get("/firstId")
                .then(function(firstId) {
                    // console.log("firstId.data: ", firstId.data);
                    vueInstance.firstId = firstId.data;
                    // TO SUPPRESS THE MORE BUTTON: compare the id of the last image in your list to that of the first image in your database:
                    if (firstId.data == vueInstance.images[vueInstance.images.length - 1].id) {
                        vueInstance.showMoreButton = false;
                    }
                })
                .catch(function(err) {
                    console.log("err in GET /firstId:", err);
                });
        }
    });
})();
