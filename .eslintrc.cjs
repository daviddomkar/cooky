module.exports = {
  "root": true,
  "extends": [
    "@nuxtjs/eslint-config-typescript",
    "@unocss",
    "prettier"
  ],
  "plugins": [
    "@ts-safeql/eslint-plugin"
  ],
  "rules": {
    "vue/attributes-order": ["error", {
      "order": [
        "DEFINITION",
        "LIST_RENDERING",
        "CONDITIONALS",
        "RENDER_MODIFIERS",
        "GLOBAL",
        ["UNIQUE", "SLOT"],
        "TWO_WAY_BINDING",
        "OTHER_DIRECTIVES",
        "OTHER_ATTR",
        "EVENTS",
        "CONTENT"
      ],
      "alphabetical": true
    }],
    "@ts-safeql/check-sql": ["error", {
      "connections": [{
          "connectionUrl": process.env.DATABASE_URL,
          "migrationsDir": "./prisma/migrations",
          "targets": [
            { "tag": "prisma.+($queryRaw|$executeRaw)", "transform": "{type}[]" }
          ]
        }]
    }],
    "import/named": "off"
  }
}
