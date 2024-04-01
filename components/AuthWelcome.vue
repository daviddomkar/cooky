<template>
  <div
    class="flex items-center justify-end rounded-r-[240px] from-primary to-secondary bg-gradient-to-b"
  >
    <div class="max-w-96 px-24 text-white">
      <h2 class="my-0 mb-4 text-3xl font-sans">Welcome to</h2>
      <h1 class="my-0 text-9xl">COOKY</h1>
      <p class="my-0 text-xl">Your interactive culinary hub where you can store personal recipes, discover new favorites, and engage with a community of food enthusiasts. Browse, rate, and save a variety of dishes shared by users around the world. Cooky transforms everyday cooking into a shared journey of culinary discovery and enjoyment.</p>
    </div>
    <div class="flex flex-col items-end justify-center">
      <AuthLink to="/auth/signup">
        Sign Up
      </AuthLink>
      <AuthLink to="/auth/login">
        Log in
      </AuthLink>
    </div>
  </div>
</template>
