import serverApi from "./server";
import showToast from "./Toast";
export function getFilters(data, component) {
    const filters = {};

    const excluded_keys = ["ratings","file", "description", "updatedAt", "name", "version","users","url","traffic", "meta","downloads","createdAt","image_placeholder","company","datePosted","expiryDate","link","poster","uploader_id","comments", "_id", "__v", "views"]

    data[`${component}`].forEach(item => {
        for (const key in item) {
            if (!excluded_keys.includes(key)) {
                if (!filters[key]) {
                    filters[key] = new Set();
                }
                filters[key].add(item[key]);
            }
        }
    });

    const filtersArray = [];
    for (const key in filters) {
        filtersArray.push({
            key: key,
            value: Array.from(filters[key])
        });
    }

    return filtersArray;
}

export async function fetchFilteredData(params, url, setData, component, setPagination) {
    try {
        const response = await serverApi.get(url,
            {
                params
            });

        if (response.status === 200) {
            let responseData = response.data.data
            const pagination = {
                total: responseData.total,
                limit: responseData.limit,
                page: responseData.page,
                count: responseData.count
            }
            setData(responseData[`${component}`])
            if (setPagination) setPagination(pagination);
        } else {
            showToast({
                message: "No result found",
                type: "error",
            })
        }
    } catch (err) {
        showToast({
            message: err.message || "An error ocurred, please contact support.",
            type: "error",
        })
    }

}

export async function fetchFirstData(url, setData, setFilterOptions, requiresAuth = false, component, setPagination, params) {
    if(requiresAuth){
        serverApi.requiresAuth(true)
    }

    return serverApi.get(url, {
        params
    })
        .then(res => {
            const responseData = res.data.data
            const pagination = {
                total: responseData.total,
                limit: responseData.limit,
                page: responseData.page,
                count: responseData.count
            }
            if (setPagination) setPagination(pagination);
            if (component !== "metrics") setData(responseData[`${component}`])
            if (component === "metrics") {
                setData(responseData)
            }
            if(setFilterOptions){
                const filters = getFilters(responseData, component);
                setFilterOptions(filters)
            }

        })
        .catch(err => {
            showToast({
                message: err.message || "An error ocurred, please contact support.",
                type: "error",
            })
        })
}