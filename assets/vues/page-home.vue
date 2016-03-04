<template>
    <div class="container">
        <article v-for="item in posts.data">
            <div class="row center">
                <h2>{{item.title.rendered}}</h2>
                <img v-bind:src="item.post_images.media_details.sizes.cardImage.source_url" alt="" class="responsive-img">
            </div>
            <div class="row flow-text">
                {{{item.content.rendered}}}
            </div>
        </article>
    </div>
</template>
<script>
module.exports = {
    data: function () {
      return {
          msg:'liste de posts',
          posts: ''
      }
    },
    // Anything within the ready function will run when the application loads
    ready: function() {
        this.fetchposts();
    },

    // Methods we want to use in our application are registered here
    methods: {
        // We dedicate a method to retrieving and setting last posts
        fetchposts: function() {
            var posts = [];
            this.$http.get('wp-json/wp/v2/posts').then(function(posts) {
                this.posts =  posts;
                var self = this;
                this.$nextTick(function () {
                    console.log(this.posts);
                });

            }).catch(function(error) {
              console.log(error);
            });
        },
    },
}
</script>