/**
 * @fileoverview Main file for draco3d package.
 */

var createEncoderModule = require('./build/draco_encoder');
var createDecoderModule = require('./build/draco_decoder');

module.exports = {
  createEncoderModule,
  createDecoderModule
}
