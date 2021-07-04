class ListNode {
  constructor(value, next) {
    this.value = value || 0
    this.next = next || null
  }
}

class LinkList {
  constructor(arr) {
    this.list = LinkList.arr2List(arr)
  }

  static arr2List(arr) {
    if (!Array.isArray(arr) && !arr.length) {
      throw 'errr'
    }
    let head = new ListNode(arr[0])
    let current = head
    arr.slice(1).forEach((item) => {
      let node = new ListNode(item)
      current.next = node
      current = node
    })
    return head
  }
  forEach() {
    let current = this.list
    let arr = []
    while (current) {
      arr.push(current.value)
      current = current.next
    }
    return arr
  }
  // k 表示位置 node 节点
  insert(k, node) {
    let current = this.list
    let i = 0
    while (current) {
      if (i === k) {
        let behind = current.next
        current.next = node
        node.next = behind
      }
      current = current.next
      i++
    }
    return this
  }
  reverse() {
    let cur = this.list
    let pre = null
    // 遍历当前链表
    while (cur !== null) {
      // 将当前指针指向前一个  并且 得记住当前后面的节点
      let temp = cur.next
      // 将当前节点指向上一个节点
      cur.next = pre
      // 改变上一个节点
      pre = cur
      cur = temp
    }
    return pre
  }

  // 判断当前链表是不是回文链表
  isParionList() {
    let current = this.list
    let res = []
    while (current) {
      res.push(current.val)
      current = current.next
    }
    return res.reverse().toString() == res.toString()
  }

  static getIntersectionNode(headA, headB) {
    const set = new Set()
    let current = headA
    while (current !== null) {
      set.add(current)
      current = current.next
    }
    current = headB
    while (current !== null) {
      if (set.has(current)) {
        return current
      }
      current = current.next
    }
    return current
  }
}

const list = new LinkList([1, 2, 3, 45])
const node1 = new ListNode(5)
console.log(list.reverse())
