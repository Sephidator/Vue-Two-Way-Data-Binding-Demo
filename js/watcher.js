class Watcher {
    /**
     * @param vm: 要绑定的SelfVue对象
     * @param propertyName: 指的是属性值的名称，在本例中是‘name’，参见index.js
     * @param cb: 修改了值过后的回调函数
     *  */
    constructor(vm, propertyName, cb) {
        this.cb = cb;
        this.vm = vm;
        this.propertyName = propertyName;
        this.value = this.subscribe();  // 将自己添加到订阅器的操作
    }
    update() {
        const value = this.vm.data[this.propertyName];
        const oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    }
    /**
     * 订阅者Watcher在初始化的时候把自己添加到订阅器Dep当中
     * 监听器Observer在get函数的时候会执行添加Watcher的操作（Dep.target一句）
     * 于是调用一次get函数来触发上述操作，并取得数据
     * 
     * 我们只需要在订阅者Watcher初始化的时候才需要添加订阅者，
     * 于是可以先在Dep.target上缓存下订阅者，添加成功之后将其去掉
     * 参见observer.js中的defineReactive方法
     * */
    subscribe() {
        Dep.target = this;  // 缓存自己
        const value = this.vm.data[this.propertyName]  // 强制执行监听器里的get函数
        Dep.target = null;  // 释放自己
        return value;
    }
}