'use strict'

var Node = function(data){
  this.data = data;
  this.next = null;
  this.previous = null;
}

var List = function(){
  this.head = null;
  this.tail = null;
  this.length = 0;
}

List.prototype.getHead = function(){
  return this.head;
}

List.prototype.getTail = function(){
  return this.tail;
}

List.prototype.append = function(data){
  var node = new Node(data);
  if(this.length){
    this.tail.next = node;
    node.previous = this.tail;
    this.tail = node;
  }
  else{
    this.head = node;
    this.tail = node;
  }

  this.length++;

  return node;
}

List.prototype.prepend = function(data){
  var node = new Node(data);

  if(this.length){
    this.head.previous = node;
    node.next = this.head;
    this.head = node;
  }
  else{
    this.head = node;
    this.tail = node;
  }

  this.length++;

  return node;
}

List.prototype.checkRange = function(position){
  if(position > this.length || position < 0){
    throw new RangeError("Uncorrect position in 'at' function");
  }
}

List.prototype.at = function(position){
  var node = this.head;
  this.checkRange(position);
  for(var count = 0; count < position; count++){
    node = node.next;
  }
  return node;
}

List.prototype.insertAt = function(position, data){
  var node = this.head, count = 0;
  var newNode = new Node(data);
  if(position == 0){
    this.head.previous = newNode;
    newNode.next = this.head;
    this.head = newNode;
  }
  else{
    node = this.at(position - 1);
    newNode.next = node.next;
    node.next.previous = newNode;
    node.next = newNode;  
    newNode.previous = node;
  }
  this.length++;
}

List.prototype.deleteAt = function(position){
  var node = this.head, count = 0;
  if(position === 0){
    this.head = node.next;
    if(this.head){
      this.head.previous = null; 
    }
    else{
      this.tail = null;
    }
  }else if(position === this.length - 1){
    this.tail = this.tail.previous;
    this.tail.next = null;    
  }else{
    node = this.at(position);
    node.previous.next = node.next;
    node.next.previous = node.previous;
    node = null;
  }
  this.length--;
}

List.prototype.reverse = function(){
  var tData;
  var tHead = this.head, tTail = this.tail;
  for(var count = Math.floor(this.length / 2); count >= 0; count--){
    tData = tHead.data;
    tHead.data = tTail.data;
    tTail.data = tData;
    tHead = tHead.next;
    tTail = tTail.previous;
  }
}

List.prototype.each = function(callback){
  var node = this.head;
  for(var count = 0; count < this.length; count++){
    callback(node);
    node = node.next;
  }
}

List.prototype.indexOf = function(data){
  var node = this.head;
  for(var count = 0; count < this.length; count++){
    if(node.data == data){
      return count;
    }
    node = node.next;
  }
  return null;
}

List.prototype.toString = function(){
  var result = "";
  var node = this.head;
  for(var i = 0; i < this.length; i++){
    (i + 1) != this.length ? result += node.data + ">" : result += node.data;    
    node = node.next;
  }
  return result;
}

// var list = new List();

// for(var i = 1; i < 6; i++){
//   list.append(i);
// }
// list.prepend(0);

// console.log("Start list: " + list.toString());
// console.log();
// console.log("Element at 4'th position: " + list.at(4).data);
// list.insertAt(0, 100);
// console.log("Insert '100' at 0 position: " + list.toString());
// list.deleteAt(5);
// console.log("Delete the 5'th element: " + list.toString());
// list.reverse();
// console.log("Reverse: " + list.toString());
// console.log("Index of '0': " + list.indexOf(0));
// list.each((item) => {item.data += 10})
// console.log("'Each' function(+10 to each element): " + list.toString());

