<script>
    import { Router, Route } from 'svelte-routing'
    import Home from './lib/Home.svelte'
    import Login from './lib/Login.svelte'
</script>

<Router>
    <Route component={Home} />
    <Route path="/login">
        <Login />
    </Route>
</Router>


