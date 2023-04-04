import request from '@/utils/request'

export function getSearchDatasource() {
  return request({
    url: 'api/config/datasource',
    method: 'get'
  })
}

export function datasourceUsable(id) {
  return request({
    url: 'api/config/datasource/usable/' + id,
    method: 'get'
  })
}

export function datasourceDisable(id) {
  return request({
    url: 'api/config/datasource/disable/' + id,
    method: 'get'
  })
}

export function datasourceAdd(data) {
  return request({
    url: 'api/config/datasource/add',
    method: 'post',
    data
  })
}

export function datasourceModify(data) {
  return request({
    url: 'api/config/datasource/modify',
    method: 'post',
    data
  })
}

export function getSearch(data) {
  return request({
    url: 'api/config/search',
    method: 'get',
    param: data
  })
}

export function getSearchCondition(searchId) {
  return request({
    url: 'api/config/search/condition/' + searchId,
    method: 'get'
  })
}

export function getSearchField(searchId) {
  return request({
    url: 'api/config/search/field/' + searchId,
    method: 'get'
  })
}

export function getSearchSql(searchId) {
  return request({
    url: 'api/config/search/sql/' + searchId,
    method: 'get'
  })
}

export function searchAdd(data) {
  return request({
    url: 'api/config/search/add',
    method: 'post',
    data
  })
}

export function searchModify(data) {
  return request({
    url: 'api/config/search/modify',
    method: 'post',
    data
  })
}

export function searchInfo(search_id) {
  return request({
    url: 'api/config/search/info/' + search_id,
    method: 'get'
  })
}

export function searchDisable(search_id, version) {
  return request({
    url: 'api/config/search/disable/' + version + '/' + search_id,
    method: 'get'
  })
}

export function searchUsable(search_id, version) {
  return request({
    url: 'api/config/search/usable/' + version + '/' + search_id,
    method: 'get'
  })
}