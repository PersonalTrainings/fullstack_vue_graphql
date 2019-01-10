<template>
  <v-container text-xs-center mt-5 pt-5>
    <!-- Add Post Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">Add Post</h1>
      </v-flex>
    </v-layout>

    <!-- Add Post From -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddPost">
          <!-- Title Input -->
          <v-layout row>
            <v-flex sm12>
              <v-text-field
                :rules="titleRules"
                v-model="title"
                label="Post Title"
                type="text"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex sm12 mb-2>
              <upload-form :onFilePicked="onFilePicked"/>
            </v-flex>
          </v-layout>

          <!-- Image Preview -->
          <v-layout v-if="imageUrl" row>
            <v-flex sm12 class="image-wrap">
              <img :src="imageUrl" height="300px">
              <span class="close-icon" @click="clearImage">&#x2715;</span>
            </v-flex>
          </v-layout>

          <!-- Categories Select -->
          <v-layout row>
            <v-flex sm12>
              <v-select
                :rules="categoriesRules"
                :items="categoryItems"
                v-model="categories"
                multiple
                label="Categories"
              ></v-select>
            </v-flex>
          </v-layout>

          <!-- Description Text Area -->
          <v-layout row>
            <v-flex sm12>
              <v-textarea
                :rules="descRules"
                v-model="description"
                label="Description"
                type="text"
                required
              ></v-textarea>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex sm12>
              <v-btn
                :loading="loading"
                :disabled="!isFormValid || loading"
                color="info"
                type="submit"
              >
                Submit
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import UploadForm from "../Shared/UploadForm";

export default {
  name: "AddPost",
  data() {
    return {
      isFormValid: true,
      title: "",
      imageName: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "Title is required",
        title => title.length < 20 || "Title must have less than 20 characters"
      ],
      imageRules: [image => !!image || this.imageUrl || "Image is required"],
      categoriesRules: [
        categories =>
          categories.length >= 1 || "At least one category is required"
      ],
      descRules: [
        desc => !!desc || "Description is required",
        desc =>
          desc.length < 200 || "Description must have less than 200 characters"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading", "user"]),
    categoryItems() {
      return [
        "Art",
        "Food",
        "Game",
        "Furniture",
        "Education",
        "Travel",
        "Photography",
        "Technolog"
      ];
    }
  },
  methods: {
    ...mapActions(["addPost"]),
    clearImage() {
      this.imageName = "";
      this.imageUrl = "";
    },
    onFilePicked(files) {
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
        });
      } else {
        this.imageName = "";
        this.imageUrl = "";
      }
    },
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.addPost({
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        });
      }
    }
  },
  components: {
    "upload-form": UploadForm
  }
};
</script>

<style>
.image-wrap {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.close-icon {
  position: absolute;
  align-self: flex-start;
  padding-right: 5px;
  cursor: pointer;
}

.close-icon:hover {
  color: red;
}
</style>

