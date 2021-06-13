class binaryTreeNode {
  constructor(value) {
    this.left = null
    this.right = null
    this.value = value || null
  }

  setValue(value) {
    this.value = value
    return this
  }

  setLeft(node) {
    this.left = node
  }

  setRight(node) {
    this.right = node
  }

  // 前序遍历
  static traverseInFront(node, total = []) {
    if (!node) {
      return
    }
    total.push(node.value)
    this.traverseInFront(node.left, total)
    this.traverseInFront(node.right, total)
    return total
  }

  // 中序遍历
  static traverseInMiddle(node, total = []) {
    if (!node) {
      return
    }
    this.traverseInMiddle(node.left, total)
    total.push(node.value)
    this.traverseInMiddle(node.right, total)
    return total
  }
  // 后序遍历
  static traverseInBack(node, total = []) {
    if (!node) {
      return
    }
    this.traverseInBack(node.left, total)
    this.traverseInBack(node.right, total)
    total.push(node.value)
    return total
  }

  // 前序遍历 with stack
  static preorderTraversal(node) {
    if (!node) {
      return
    }
    let res = []
    let stack = [node]
    while (stack.length) {
      let cur = stack.pop()
      res.push(cur.value)
      if (cur.right) {
        stack.push(cur.right)
      }
      if (cur.left) {
        stack.push(cur.left)
      }
    }
    return res
  }

  // 后序遍历
  static behindorderTraversal(node) {
    if (!node) {
      return
    }
    let res = []
    let stack = [node]
    while (stack.length) {
      let cur = stack.pop()
      // 这里的话 后序遍历 其实 左 - 右 - 根
      // 所以其实根节点其实是在后面
      res.unshift(cur.value)
      if (cur.left) {
        stack.push(cur.left)
      }
      if (cur.right) {
        stack.push(cur.right)
      }
    }
    return res
  }

  // 中序遍历
  static inorderTraversal(node) {
    // 定义结果数组
    const res = []
    // 初始化栈结构
    const stack = []
    // 用一个 cur 结点充当游标
    let cur = node
    // 当 cur 不为空、或者 stack 不为空时，重复以下逻辑
    while (cur || stack.length) {
      // 这个 while 的作用是把寻找最左叶子结点的过程中，途径的所有结点都记录下来
      while (cur) {
        // 将途径的结点入栈
        stack.push(cur)
        // 继续搜索当前结点的左孩子
        cur = cur.left
      }
      // 取出栈顶元素
      cur = stack.pop()
      // 将栈顶元素入栈
      res.push(cur.val)
      // 尝试读取 cur 结点的右孩子
      cur = cur.right
    }
    // 返回结果数组
    return res
  }

  // 层序遍历
  static bfs(node) {
    if (!node) {
      return
    }
    let queue = [node]
    let res = []
    while (queue.length) {
      const cur = queue.shift()
      res.push(cur.value)
      if (cur.left) {
        queue.push(cur.left)
      }
      if (cur.right) {
        queue.push(cur.right)
      }
    }
    return res
  }

  // 求树的高度
  static getMaxHeight(node) {
    if (!node) {
      return 0
    }
    let leftHeight = this.getMaxHeight(node.left)
    let rightHeight = this.getMaxHeight(node.right)
    return Math.max(leftHeight, rightHeight) + 1
  }

  // 镜像二叉树 反转二叉树
  static mirror(node) {
    // 这是递归的终止条件
    if (!node) {
      return node
    }
    let left = this.mirror(node.left)
    let right = this.mirror(node.right)
    node.left = right
    node.right = left
    return node
  }
}

function a() {
  return 1
}

function b() {
  return a() + 1
}

function c() {
  return b() + 1
}

let treeRoot = new binaryTreeNode(1)
let node1 = new binaryTreeNode(2)
let node2 = new binaryTreeNode(3)
let node3 = new binaryTreeNode(4)
let node4 = new binaryTreeNode(5)
let node5 = new binaryTreeNode(6)
let node6 = new binaryTreeNode(7)

treeRoot.setLeft(node1)
treeRoot.setRight(node2)
node1.setLeft(node3)
node1.setRight(node4)
node2.setLeft(node5)
node2.setRight(node6)
const res1 = binaryTreeNode.traverseInFront(treeRoot)
const res2 = binaryTreeNode.traverseInMiddle(treeRoot)
const res3 = binaryTreeNode.traverseInBack(treeRoot)
const res4 = binaryTreeNode.preorderTraversal(treeRoot)
const res5 = binaryTreeNode.behindorderTraversal(treeRoot)
const res6 = binaryTreeNode.bfs(treeRoot)
const height = binaryTreeNode.getMaxHeight(treeRoot)
console.log(res6, height, '999')
