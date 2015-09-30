/**
 * Marc leader
 * @param {String} data
 * @constructor
 */
function Leader(data) {
  this._data = data || '';
}

Leader.prototype.getData = function() {
  return this._data;
};

Leader.prototype.setData = function(newData) {
  this._data = newData || '';
  return this;
};


/**
 * Abstrcat class for subfield
 * @param {String} id
 */
function Subfield(id) {
  if (this.constructor === Subfield) {
    throw new Error("Can't instantiate abstract class");
  }

  this._id = id || '';

  _validateSubfieldIdArg(this._id);
}

Subfield.prototype.getId = function() {
  return this._id;
};

/**
 * Data subfield in marc field
 * @param {String} id
 * @param {String} data
 * @constructor
 */
function DataSubfield(id, data) {
  Subfield.call(this, id);
  this._data = data || '';
}

DataSubfield.prototype = Object.create(Subfield.prototype);
DataSubfield.prototype.constructor = DataSubfield;

DataSubfield.prototype.getData = function() {
  return this._data;
};

DataSubfield.prototype.setData = function(data) {
  this._data = data || '';
  return this;
};

DataSubfield.prototype.toJson = function() {
  return {
    id: this.getId(),
    d: this._data,
  };
};

DataSubfield.fromJson = function(json) {
  if (!json.id) {
    throw new Error('DataSubfield required json id does not exist');
  }

  return new DataSubfield(json.id, json.d);
};


/**
 * Extended subfield
 * @param {String} id
 * @param {Array} fields
 * @constructor
 */
function ExtendedSubfield(id, fields) {
  Subfield.call(this, id);

  this._fields = fields || [];

  _validateFieldsArg(this._fields);
}

ExtendedSubfield.prototype = Object.create(Subfield.prototype);
ExtendedSubfield.prototype.constructor = ExtendedSubfield;

ExtendedSubfield.prototype.getId = function() {
  return this._id;
};

ExtendedSubfield.prototype.getFields = function(tag) {
  return _getFields(this._fields, tag);
};

ExtendedSubfield.prototype.findFields = function(regexp) {
  return _findFields(this._fields, regexp);
};

ExtendedSubfield.prototype.addField = function(field) {
  this._fields.push(field);
  return this;
};

ExtendedSubfield.prototype.removeField = function(field) {
  var fieldIndex = this._fields.indexOf(field);
  if (fieldIndex > -1) {
    this._fields.splice(fieldIndex, 1);
  }
  return this;
};

ExtendedSubfield.prototype.getFieldsIndex = function() {
  return _buildFieldsIndex(this._fields);
};

ExtendedSubfield.prototype.toJson = function() {
  var cf = [];
  var df = [];
  for (var i = 0; i < this._fields.length; i++) {
    var _field = this._fields[i];
    if (_field instanceof DataField) {
      df.push(_field);
    } else {
      cf.push(_field);
    }
  }
  return {
    id: this.getId(),
    cf: cf,
    df: df,
  };
};


ExtendedSubfield.fromJson = function(json) {
  var fields = [];
  var cf = json.cf || [];
  var df = json.df || [];
  var i = 0;

  if (!Array.isArray(cf)) {
    throw new Error('ExtendedSubfield json property cf must be array');
  }

  if (!Array.isArray(df)) {
    throw new Error('ExtendedSubfield json property df must be array');
  }

  for (i = 0; i < cf.length; i++) {
    fields.push(ControlField.fromJson(cf[i]));
  }

  for (i = 0; i < df.length; i++) {
    fields.push(DataField.fromJson(df[i]));
  }

  return new ExtendedSubfield(json.id, fields);
};


/**
 * Abstract class for field
 * @param {String} tag
 * @param {String} data
 * @constructor
 */
function Field(tag) {
  if (this.constructor === Field) {
    throw new Error("Can't instantiate abstract class");
  }

  this._tag = tag || '';
  _validateTagArg(this._tag);
}

Field.prototype.getTag = function() {
  return this._tag;
};

/**
 * Marc control filed
 * @param {String} tag
 * @param {String} data
 * @constructor
 */
function ControlField(tag, data) {
  Field.call(this, tag);
  this._data = data || '';
}

ControlField.prototype = Object.create(Field.prototype);
ControlField.prototype.constructor = ControlField;

ControlField.prototype.getData = function() {
  return this._data;
};

ControlField.prototype.setData = function(data) {
  this._data = data || '';
  return this;
};

ControlField.prototype.toJson = function() {
  return {
    tag: this.getTag(),
    d: this._data,
  };
};

ControlField.fromJson = function(json) {
  if (!json.tag) {
    throw new Error('ControlField required json property tag does not exist');
  }
  return new ControlField(json.tag, json.d);
};


/**
 * Field with subfields
 * @param {String} tag
 * @param {String} i1
 * @param {String} i2
 * @param {String} subfields
 * @constructor
 */
function DataField(tag, i1, i2, subfields) {
  Field.call(this, tag);

  this._i1 = i1 || ' ';
  this._i2 = i2 || ' ';
  this._subfields = subfields || [];

  _validateIndicatorArg(this._i1);
  _validateIndicatorArg(this._i2);
  _validateSubfieldsArg(this._subfields);
}

DataField.prototype = Object.create(Field.prototype);
DataField.prototype.constructor = DataField;

DataField.prototype.setInd1 = function(ind) {
  this._i1 = ind || ' ';
  _validateIndicatorArg(this._i1);
  return this;
};

DataField.prototype.setInd2 = function(ind) {
  this._i2 = ind || ' ';
  _validateIndicatorArg(this._i2);
  return this;
};

DataField.prototype.setSubfields = function(subfields) {
  this._subfields = subfields || [];
  _validateSubfieldsArg(this._subfields);
  return this;
};

DataField.prototype.getSubfields = function(id) {
  if (id) {
    var _subfields = [];
    var _i = 0;
    for (_i = 0; _i < this._subfields.length; _i++) {
      var __subfield = this._subfields[_i];
      if (__subfield.getId() === id) {
        _subfields.push(__subfield);
      }
    }
    return _subfields;
  }
  return this._subfields;
};

DataField.prototype.addSubfield = function(subfield) {
  if (!(subfield instanceof Subfield)) {
    throw new Error('subfield must be Subfield instance');
  }

  this._subfields.push(subfield);
  return this;
};

DataField.prototype.removeSubfield = function(subfield) {
  var sfIndex = this._subfields.indexOf(subfield);
  if (sfIndex > -1) {
    subfield.splice(sfIndex, 1);
  }
  return this;
};

DataField.prototype.getSubfieldData = function(id) {
  var data = [];
  var i = 0;
  for (i = 0; i < this._subfields.length; i++) {
    var _subfield = this._subfields[i];
    if (_subfield instanceof DataSubfield && _subfield.getId() === id) {
      data.push(_subfield.getData());
    }
  }
  return data;
};

DataField.prototype.getSubfieldsIndex = function() {
  return _buildSubfieldsIndex(this._subfields);
};

DataField.prototype.toJson = function() {
  var sf = [];
  var esf = [];
  var i = 0;

  for (i = 0; i < this._subfields.length; i++) {
    var _subfield = this._subfields[i];
    if (_subfield instanceof DataSubfield) {
      sf.push(_subfield);
    } else {
      esf.push(_subfield);
    }
  }

  return {
    tag: this.getTag(),
    i1: this._i1,
    i2: this._i2,
    sf: sf,
    esf: esf,
  };
};

DataField.fromJson = function(json) {
  var subfields = [];
  var sf = json.sf || [];
  var esf = json.esf || [];
  var i = 0;

  if (!Array.isArray(sf)) {
    throw new Error('DataField json property sf must be array');
  }

  if (!Array.isArray(esf)) {
    throw new Error('DataField json property esf must be array');
  }

  for (i = 0; i < sf.length; i++) {
    subfields.push(DataSubfield.fromJson(sf[i]));
  }

  for (i = 0; i < esf.length; i++) {
    subfields.push(ExtendedSubfield.fromJson(esf[i]));
  }

  return new DataField(json.tag, json.i1, json.i2, subfields);
};


/**
 *
 * @param {Leader} leader
 * @param {Array} fields
 * @constructor
 */
function Record(leader, fields) {
  this._leader = leader || new Leader();
  this._fields = fields || [];

  _validateFieldsArg(this._fields);
}

Record.prototype.setLeader = function(leader) {
  this._leader = leader;
  return this;
};

Record.prototype.getLeader = function() {
  return this._leader;
};

Record.prototype.setFields = function(fields) {
  _validateFieldsArg(fields);
  this._fields = fields;
  return this;
};

Record.prototype.getFields = function(tag) {
  return _getFields(this._fields, tag);
};


Record.prototype.findFields = function(regexp) {
  return _findFields(this._fields, regexp);
};


Record.prototype.addField = function(field) {
  if (!(field instanceof Field)) {
    throw new Error('field must be ControlField or DataField instance');
  }
  this._fields.push(field);
  return this;
};

Record.prototype.removeField = function(field) {
  if (!(field instanceof Field)) {
    throw new Error('field must be ControlField or DataField instance');
  }
  var fieldIndex = this._fields.indexOf(field);
  if (fieldIndex > -1) {
    this._fields.splice(fieldIndex, 1);
  }
  return this;
};

Record.prototype.getFieldsIndex = function() {
  return _buildFieldsIndex(this._fields);
};

Record.prototype.toJson = function() {
  var cf = [];
  var df = [];
  var i = 0;

  for (i = 0; i < this._fields.length; i++) {
    var _field = this._fields[i];
    if (_field instanceof DataField) {
      df.push(_field);
    } else {
      cf.push(_field);
    }
  }

  return {
    l: this._leader.getData(),
    cf: cf,
    df: df,
  };
};

/**
 * @param {String|Object} json
 * @param {Function} callback - fn(record, error)
 * @return {Record|null}
 * @throw {Error} if no callback
 */
Record.fromJson = function(json, callback) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }

  if (typeof json !== 'object') {
    json = JSON.parse(json);
    var _error = new Error('json must be object or string instance');
    if (typeof callback === 'function') {
      callback(null, _error);
      return null;
    } else {
      throw _error;
    }
  }

  var leader = new Leader(json.l);
  var fields = [];
  var cf = json.cf || [];
  var df = json.df || [];
  var i = 0;

  try {
    if (!Array.isArray(cf)) {
      throw new Error('Record json property cf must be array');
    }

    if (!Array.isArray(df)) {
      throw new Error('Record json property df must be array');
    }

    for (i = 0; i < cf.length; i++) {
      fields.push(ControlField.fromJson(cf[i]));
    }

    for (i = 0; i < df.length; i++) {
      fields.push(DataField.fromJson(df[i]));
    }
  } catch (e) {
    if (typeof callback === 'function') {
      callback(null, e);
      return null;
    } else {
      throw _error;
    }
  }

  if (typeof callback === 'function') {
    callback(record, null);
  }
  var record = new Record(leader, fields);
  return record;
};



function _validateTagArg(tag) {
  if (typeof tag !== 'string' || !tag) {
    throw new Error('Field must have String tag');
  }
}

function _validateIndicatorArg(ind) {
  if (typeof ind !== 'string' || ind.length !== 1) {
    throw new Error('DataField indicator must be String from one symbol');
  }
}

function _validateSubfieldsArg(subfields) {
  if (!Array.isArray(subfields)) {
    throw new Error('DataField subfields must be Array instance');
  }

  var i = 0;

  for (i = 0; i < subfields.length; i++) {
    var _subfield = subfields[i];
    if (!(_subfield instanceof Subfield)) {
      throw new Error('Subfield at index ' + i + ' must be DataSubfield or ExtendedSubfield instance');
    }
  }
}

function _validateSubfieldIdArg(id) {
  if (typeof id !== 'string' || !id) {
    throw new Error('DataSubfield must have id');
  }
}

function _validateFieldsArg(fields) {
  if (!Array.isArray(fields)) {
    throw new Error('Fields of extended subfield must be Array instance');
  }

  var i = 0;

  for (i = 0; i < fields.length; i++) {
    var _field = fields[i];
    if (!(_field instanceof Field)) {
      throw new Error('Field at index ' + i + ' must be ControlField or DataField instance');
    }
  }
}

/**
 *
 * @param {Array} fields
 * @param {String} tag - filter
 * @returns {{String: Array}}
 */
function _getFields(fields, tag) {
  if (tag) {
    var _fields = [];
    for (var _i = 0; _i < fields.length; _i++) {
      var _field = fields[_i];
      if (_field.getTag() === tag) {
        _fields.push(_field);
      }
    }
    return _fields;
  }
  return fields;
}

/**
 *
 * @param {Array} fields
 * @param {String|Regexp} regexp - rag regexp
 * @returns {{String: Array}}
 */
function _findFields(fields, regexp) {
  var re = regexp;
  if (!(re instanceof RegExp)) {
    re = new RegExp(re);
  }

  var _fields = [];
  for (var _i = 0; _i < fields.length; _i++) {
    var _field = fields[_i];
    if (Array.isArray(_field.getTag().match(re))) {
      _fields.push(_field);
    }
  }
  return _fields;
}

/**
 *
 * @param {Array} fields
 * @returns {{String: Array}}
 */
function _buildFieldsIndex(fields) {
  var index = {};
  var i = 0;
  for (i = 0; i < fields.length; i++) {
    var _field = fields[i];
    var _tag = _field.getTag();
    var _existFields = index[_tag];

    if (!_existFields) {
      _existFields = [];
      index[_tag] = _existFields;
    }
    _existFields.push(_field);
  }
  return index;
}

/**
 *
 * @param subfields
 * @returns {{String: Array}}
 */
function _buildSubfieldsIndex(subfields) {
  var index = {};
  var i = 0;
  for (i = 0; i < subfields.length; i++) {
    var _subfield = subfields[i];
    var _id = _subfield.getId();
    var _existsubfields = index[_id];

    if (!_existsubfields) {
      _existsubfields = [];
      index[_id] = _existsubfields;
    }

    _existsubfields.push(_subfield);
  }
  return index;
}


export default {
  Record,
  Leader,
  Field,
  ControlField,
  DataField,
  DataSubfield,
  ExtendedSubfield,
}
