const pathAfterSave = (module, modulePath, pathname = "") => {
    const fallback = module ? modulePath : "/";
    if (!pathname) {
        return fallback;
    }

    if (/\/(add|create)$/.test(pathname)) {
        return pathname.replace(/\/(add|create)$/, "") || fallback;
    }

    const recordEdit = pathname.match(/^(.*)\/[^/]+\/edit$/);
    if (recordEdit) {
        return recordEdit[1] || fallback;
    }

    const editRecord = pathname.match(/^(.*)\/edit\/[^/]+$/);
    if (editRecord) {
        return editRecord[1] || fallback;
    }

    return fallback;
};

export { pathAfterSave };
