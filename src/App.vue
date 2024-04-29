<template>
    <div class="view-content">
        <h1>Hello App!</h1>
        <p>
            <strong>Current route path: </strong> {{ $route.fullPath }}
        </p>
        <nav>
            <button onclick="router.push('/')">Go to Onboarding</button>
            <button onclick="router.push('/dashboard')">Go to Dashboard</button>
        </nav>
        <main>
            <RouterView />
        </main>
    </div>
</template>

<script>
</script>
