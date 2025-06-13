<template>
  <div>
    <gov-grid-row>
      <gov-grid-column width="two-thirds">
        <gov-heading size="l">Collection: Categories</gov-heading>

        <gov-body>
          On this page, you can select which taxonomies apply for each category
          on the front page. You can also add categories using the button above.
        </gov-body>

        <gov-body>
          You can move categories up and down. This denotes the order in which
          the categories appear on the home page. The category at the top of the
          list will appear on the upper-leftmost corner.
        </gov-body>
      </gov-grid-column>

      <gov-grid-column v-if="auth.isSuperAdmin" width="one-third">
        <gov-button
          :to="{ name: 'collections-categories-create' }"
          success
          expand
          >Add a new category</gov-button
        >
      </gov-grid-column>
    </gov-grid-row>

    <gov-section-break size="l" />

    <!-- Loop through each category -->
    <gov-grid-row>
      <gov-grid-column width="two-thirds">
        <ck-loader v-if="loading" />
<!--        <gov-list v-else bullet>-->
<!--          <collection-list-item-->
<!--            v-for="collection in collections"-->
<!--            :key="collection.id"-->
<!--            :collection="collection"-->
<!--            :collections="collections"-->
<!--            edit-collection-route="collections-categories-edit"-->
<!--            @move-up="onMoveUp"-->
<!--            @move-down="onMoveDown"-->
<!--          />-->
<!--        </gov-list>-->
        <ck-tree-list
            v-else
            key="collectioncategorieslist"
            :nodes="categoriesTree"
            edit="collections-categories-edit"
            nodeType="collection"
            :bullet="true"
            @move-up="onMoveUp"
            @move-down="onMoveDown"
        >
<!--          <template v-if="showView" slot="edit" slot-scope="editProps">-->
<!--            <gov-link-->
<!--                :to="{-->
<!--                name: 'pages-show',-->
<!--                params: { page: editProps.node.id }-->
<!--              }"-->
<!--            >-->
<!--              View-->
<!--            </gov-link>-->
<!--          </template>-->
        </ck-tree-list>
      </gov-grid-column>
    </gov-grid-row>
  </div>
</template>

<script>
import http from "@/http";
import CollectionListItem from "./CollectionListItem";
import CkTreeList from "@/components/Ck/CkTreeList.vue";

export default {
  name: "ListCollectionCategories",

  components: { CollectionListItem, CkTreeList },

  data() {
    return {
      loading: false,
      collections: []
    };
  },
  computed: {
    categoriesTree() {
      return this.buildCategoriesTree(
          this.collections.filter(category => {
            return !category.parent;
          })
      )
    }
  },
  methods: {
    async fetchCollections() {
      this.loading = true;
      this.collections = await this.fetchAll("/collections/categories?include=children,parent");
      this.collections = this.collections.map(collection => {
        return {
          label: collection.name,
          ...collection
        }
      })
      this.loading = false;
    },
    async onMoveUp(collection) {
      this.loading = true;

      await http.put(`/collections/categories/${collection.id}`, {
        ...this.parseCollectionForUpdate(collection),
        order: collection.order - 1
      });

      this.fetchCollections();
    },
    buildCategoriesTree(categories, parsed = [], depth = 0) {
      categories
          .sort((cat1, cat2) => {
            return cat1.order - cat2.order;
          })
          .forEach(category => {
            category.children = this.collections.filter(
                child => child.parent && child.parent.id === category.id
            );

            if (depth === 0) {
              parsed.push(category);
            }

            if (category.children.length > 0 && depth < 4) {
              parsed = this.buildCategoriesTree(category.children, parsed, depth + 1);
            }
          });

      return parsed;

    },
    async onMoveDown(collection) {
      this.loading = true;

      await http.put(`/collections/categories/${collection.id}`, {
        ...this.parseCollectionForUpdate(collection),
        order: collection.order + 1
      });

      this.fetchCollections();
    },
    parseCollectionForUpdate(collection) {
      return {
        name: collection.name,
        intro: collection.intro,
        icon: collection.icon,
        order: collection.order,
        enabled: collection.enabled,
        homepage: collection.homepage,
        sideboxes: collection.sideboxes,
        category_taxonomies: collection.category_taxonomies.map(
          taxonomy => taxonomy.id
        )
      };
    }
  },
  created() {
    this.fetchCollections();
  }
};
</script>
