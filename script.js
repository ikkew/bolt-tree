let familyTree = {};

function addFamilyMember() {
    const name = document.getElementById('name').value.trim();
    const parent = document.getElementById('parent').value.trim();

    if (!name) {
        showError('名前を入力してください。');
        return;
    }

    if (familyTree[name]) {
        showError('この名前はすでに存在します。');
        return;
    }

    if (parent && !familyTree[parent]) {
        showError('指定された親が存在しません。');
        return;
    }

    if (parent && familyTree[parent]) {
        if (!familyTree[parent].children) {
            familyTree[parent].children = [];
        }
        familyTree[parent].children.push(name);
    }
    familyTree[name] = { name: name };
    renderFamilyTree();
    clearInputs();
    clearError();
}

function deleteFamilyMember(name) {
    delete familyTree[name];
    Object.values(familyTree).forEach(member => {
        if (member.children) {
            member.children = member.children.filter(child => child !== name);
        }
    });
    renderFamilyTree();
}

function renderFamilyTree() {
    const treeElement = document.getElementById('family-tree');
    treeElement.innerHTML = '';

    const rootMembers = Object.values(familyTree).filter(member => !Object.values(familyTree).some(m => m.children && m.children.includes(member.name)));
    
    rootMembers.forEach(member => {
        treeElement.appendChild(createMemberElement(member));
    });
}

function createMemberElement(member) {
    const element = document.createElement('div');
    element.className = 'family-member';
    element.textContent = member.name;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = () => deleteFamilyMember(member.name);
    element.appendChild(deleteButton);

    if (member.children) {
        const childrenElement = document.createElement('div');
        childrenElement.className = 'children';
        member.children.forEach(childName => {
            childrenElement.appendChild(createMemberElement(familyTree[childName]));
        });
        element.appendChild(childrenElement);
    }

    return element;
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
}

function clearError() {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = '';
}

function clearInputs() {
    document.getElementById('name').value = '';
    document.getElementById('parent').value = '';
}

// 初期表示
renderFamilyTree();