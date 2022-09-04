const AppService = {
    getWindowSize: () => {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }
}

export default AppService;