import axios from 'axios';
import Qs from 'qs';
// var instance = axios.create({
//   baseURL: 'http://52.83.161.249:8011',
//   timeout: 1000,
//   headers: {
//     'Access-Control-Allow-Origin': '*',
//     'Accept': 'application/json',  
//     'Content-Type': 'application/json' 
//   }
// });

const instance = axios.create({
  baseURL: 'http://wy8.yuangaofen.com/',
  headers:{
    // .header("Content-Type", "application/json;charset=utf-8");
      'Content-Type':'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'x-requested-with':'XMLHttpRequest'
  },
  // transformRequest: [function (data) {
  //     data = Qs.stringify(data);
  //     return data;
  // }],
  withCredentials:true   //加了这段就可以跨域了 
});

let base = 'http://wy8.yuangaofen.com/'; //ip地址
// axios.defaults.headers['Content-Type'] = 'application/json';

//登陆api
// params{userid:"13888888888",pswd:"123450"}
export const login = params => { return instance.post(`/services/mainsvc.asmx/TryLogin1`, params).then(res => res.data) }

//blockList
// {crypedUserid:"32860B1228CDAF94",examid:"EXAM115",subjectid:"33"}
export const getTaskboard = params => { return instance.post(`/services/mainsvc.asmx/getTaskboardByUseridByExamAndSubj`, params).then(res => res.data) }

//getSchool
// {examlist:"EXAM115"}
export const getSchool = params => { return instance.post(`/services/mainsvc.asmx/getRoleSchool`, params).then(res => res.data) }

//getClassBySchool
//{examid:"EXAM115",subjectid:33,school:"树德怀远中学"}
export const getClassBySchool = params => { return instance.post(`/services/mainsvc.asmx/getClassroomsByschool`, params).then(res => res.data) }

//获取批阅卷子列表
// {examid:"EXAM115",subjectid:"33",userid:"32860B1228CDAF94",itemid:"1",tasktype:"N",iFetchRoleid:0,iProblem:0,isFirst:1,checkcode:"411558"}
export const getUnMarkBuffer = params => { return instance.post(`/services/mainsvc.asmx/GetUnMarkBuffer`, params).then(res => res.data) }

//获取批阅卷子列表用户信息
//{u:"32860B1228CDAF94"}
export const transLink = params => { return instance.post(`/services/mainsvc.asmx/TransLink`, params).then(res => res.data) }

//{examid:"EXAM115",subjectid:"33",itemlist:"(1,2,3,4,5,6,7,8,9,10,11,15,16,17,18,19,20)"}
export const GetSubjectAllItemReportEx = params => { return instance.post(`/services/mainsvc.asmx/GetSubjectAllItemReportEx`, params).then(res => res.data) }

//{examid:"EXAM115",subjectid:"33",uL:''}
export const getHeaderIteminfo = params => { return instance.post(`/services/mainsvc.asmx/getHeaderIteminfo`, params).then(res => res.data) }

// {examid:"EXAM115"}
// {examid:"EXAM115",subjectid:"33",userid:"32860B1228CDAF94",itemid:"1",tasktype:"N",iFetchRoleid:0,iProblem:0,isFirst:1,checkcode:"107805"}
export const GetUnMarkBuffer = params => { return instance.post(`/services/mainsvc.asmx/GetUnMarkBuffer`, params).then(res => res.data) }

// {examid:"EXAM115"}
export const isVirSegment = params => { return instance.post(`/services/mainsvc.asmx/isVirSegment`, params).then(res => res.data) }

// {examid:"EXAM115"}
export const getItemSubmitConfirm = params => { return instance.post(`/services/mainsvc.asmx/getItemSubmitConfirm`, params).then(res => res.data) }

// {examid:"EXAM115",subjectid:33,userid:1658,itemid:1}
export const ShowReport = params => { return instance.post(`/services/mainsvc.asmx/ShowReport`, params).then(res => res.data) }

// {examid:"EXAM115",subjectid:33,userid:1658,itemid:1}
export const drawPersonAndAll = params => { return instance.post(`/services/mainsvc.asmx/drawPersonAndAll`, params).then(res => res.data) }


// {examid:"EXAM115",subjectid:"33",itemid:"1"}
export const GetItemInfo = params => { return instance.post(`/services/mainsvc.asmx/GetItemInfo`, params).then(res => res.data) }

// {examid:"EXAM115",subjectid:"33",userid:"1658",itemid:"1"}
export const GetPersonInfoInDB = params => { return instance.post(`/services/mainsvc.asmx/GetPersonInfoInDB`, params).then(res => res.data) }

// {examid:"EXAM115",subjectid:33,userid:1658,taskid:9132,vtime:9,itemid:1,score:0,subscore:"0,0",memo:"",ann:"right$50$3$	right$94$2$",chkcode:593018}
export const submitSmart = params => { return instance.post(`/services/mainsvc.asmx/Submit_smart`,params).then(res => res.data) }

// {examid:"EXAM115",subjectid:33,userid:1658,itemid:1}
export const ShowFavorite = params => { return instance.post(`/services/mainsvc.asmx/ShowFavorite`, params).then(res => res.data) }

// {examid:"EXAM115",subjectid:33,userid:1658,itemid:1,paperid:111347,path:"http://52.83.161.249:8013/cut/33/115/1/1/111347_1.jpg",desc:"dsafdsa"}
export const AddFavorite = params => { return instance.post(`/services/mainsvc.asmx/AddFavorite`, params).then(res => res.data) }


// {examid:"EXAM115",subjectid:"33",userid:"1658",itemid:"1",tasktype:"N",iFetchRoleid:0,iProblem:0}
export const GetMarkedBuffer = params => { return instance.post(`/services/mainsvc.asmx/GetMarkedBuffer`, params).then(res => res.data) }

// {examid:"EXAM115",subjectid:33,userid:1658,itemid:1,fetchroleid:0 }
export const PopTaskAll = params => { return instance.post(`/services/mainsvc.asmx/PopTaskAll`, params).then(res => res.data) }

