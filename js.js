const keywords = ['swift', 'rust', 'javascript', 'react', 'python', 'ruby', 'django'];

const logs = [];

const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

async function runSearch() {
    if (keywords.length > 0) {
        const currentSearchKeywords = keywords.splice(0, 5);

        const promises = currentSearchKeywords.map((keyword) => {
            return fetch(`https://api.github.com/search/repositories?q=${keyword}`, requestOptions)
        })

        const searchResponses = await Promise.allSettled(promises);
        const jsonDataList = await Promise.all(searchResponses.map(response => response.value.json()));
        for (let i = 0; i < jsonDataList.length; i++) {
            const jsonData = jsonDataList[i];

            if (searchResponses[i].status === "fulfilled" && searchResponses[i].value.status === 200) {
                console.log(`keywords: ${currentSearchKeywords[i]} - success: ${true}`);
                console.log("first item: ", jsonData.items[0])
            } else {
                console.log(`keywords: ${currentSearchKeywords[i]} - success: ${false}`);
                console.log("first item: ", undefined)
                keywords.push(currentSearchKeywords[i]);
            }
        }
        return runSearch()
    }
}

runSearch()