module.exports = [
  {
    "__type__": "cc.Texture2D",
    "content": "0,9729,9729,33071,33071,0,0,1"
  },
  {
    "__type__": "cc.EffectAsset",
    "_name": "builtin-2d-spine",
    "properties": {
      "texture": {
        "type": 13,
        "value": null
      },
      "alphaThreshold": {
        "value": 0.5
      }
    },
    "techniques": [
      {
        "passes": [
          {
            "cullMode": 0,
            "blend": true,
            "program": "7b385aeea63c6235fbf39dd4bf009f23c884ecc0ebb6dcef392ae264"
          }
        ],
        "layer": 0,
        "stages": [
          "opaque"
        ],
        "queue": 0,
        "priority": 0
      }
    ],
    "shaders": [
      {
        "vert": "\n#define _IS_VERT_SHADER 1\n\nprecision highp float;\n\nuniform mat4 cc_matViewProj;\n\n#if _USE_MODEL\n  uniform mat4 cc_matWorld;\n#endif\n\nattribute vec3 a_position;\nattribute lowp vec4 a_color;\n#if USE_TINT\n  attribute lowp vec4 a_color0;\n#endif\n\nattribute mediump vec2 a_uv0;\nvarying mediump vec2 v_uv0;\n\nvarying lowp vec4 v_light;\n#if USE_TINT\n  varying lowp vec4 v_dark;\n#endif\n\nvoid main () {\n  mat4 mvp;\n  \n  #if _USE_MODEL\n    mvp = cc_matViewProj * cc_matWorld;\n  #else\n    mvp = cc_matViewProj;\n  #endif\n\n  v_uv0 = a_uv0;\n\n  v_light = a_color;\n  #if USE_TINT\n    v_dark = a_color0;\n  #endif\n\n  gl_Position = mvp * vec4(a_position, 1);\n}\n\n\n",
        "frag": "\n#define _IS_FRAG_SHADER 1\n\nprecision highp float;\n\nuniform sampler2D texture;\nvarying mediump vec2 v_uv0;\n\n#if USE_ALPHA_TEST\n  uniform float alphaThreshold;\n#endif\n\nvoid ALPHA_TEST (in vec4 color) {\n  #if USE_ALPHA_TEST\n      if (color.a < alphaThreshold) discard;\n  #endif\n}\n\nvoid ALPHA_TEST (in float alpha) {\n  #if USE_ALPHA_TEST\n      if (alpha < alphaThreshold) discard;\n  #endif\n}\n\nvarying lowp vec4 v_light;\n#if USE_TINT\n  varying lowp vec4 v_dark;\n#endif\n\nvoid main () {\n  vec4 texColor = texture2D(texture, v_uv0);\n  #if _USE_ETC1_TEXTURE\n      texColor.a *= texture2D(texture, v_uv0 + vec2(0, 0.5)).r;\n  #endif\n  vec4 finalColor;\n\n  #if USE_TINT\n    finalColor.a = v_light.a * texColor.a;\n    finalColor.rgb = ((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb;\n  #else\n    finalColor = texColor * v_light;\n  #endif\n\n  ALPHA_TEST(finalColor);\n\n  gl_FragColor = finalColor;\n}\n\n\n",
        "defines": [
          {
            "name": "_USE_MODEL",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "USE_TINT",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "USE_ALPHA_TEST",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_ETC1_TEXTURE",
            "type": "boolean",
            "defines": []
          }
        ],
        "uniforms": [
          {
            "name": "texture",
            "type": 13,
            "defines": []
          },
          {
            "name": "alphaThreshold",
            "type": 4,
            "property": true,
            "defines": [
              "USE_ALPHA_TEST"
            ]
          }
        ],
        "attributes": [
          {
            "name": "a_position",
            "type": 6,
            "defines": []
          },
          {
            "name": "a_color",
            "type": 7,
            "defines": []
          },
          {
            "name": "a_color0",
            "type": 7,
            "defines": [
              "USE_TINT"
            ]
          },
          {
            "name": "a_uv0",
            "type": 5,
            "defines": []
          }
        ],
        "extensions": [],
        "name": "7b385aeea63c6235fbf39dd4bf009f23c884ecc0ebb6dcef392ae264"
      }
    ]
  },
  {
    "__type__": "cc.EffectAsset",
    "_name": "builtin-2d-gray-sprite",
    "properties": {
      "texture": {
        "type": 13,
        "value": null
      }
    },
    "techniques": [
      {
        "passes": [
          {
            "cullMode": 0,
            "blend": true,
            "program": "4c10e7ec534d3f65baabc458cc91fd8dfe66821a283acb75aea070ac"
          }
        ],
        "layer": 0,
        "stages": [
          "opaque"
        ],
        "queue": 0,
        "priority": 0
      }
    ],
    "shaders": [
      {
        "vert": "\n#define _IS_VERT_SHADER 1\n\nprecision highp float;\n\nuniform mat4 cc_matViewProj;\nattribute vec3 a_position;\nattribute mediump vec2 a_uv0;\nvarying mediump vec2 v_uv0;\n\nvoid main () {\n  gl_Position = cc_matViewProj * vec4(a_position, 1);\n  v_uv0 = a_uv0;\n}\n\n\n",
        "frag": "\n#define _IS_FRAG_SHADER 1\n\nprecision highp float;\n\nuniform sampler2D texture;\nvarying mediump vec2 v_uv0;\n\nvoid main () {\n  vec4 color = texture2D(texture, v_uv0);\n  #if _USE_ETC1_TEXTURE\n      color.a *= texture2D(texture, v_uv0 + vec2(0, 0.5)).r;\n  #endif\n  float gray = 0.2126*color.r + 0.7152*color.g + 0.0722*color.b;\n  gl_FragColor = vec4(gray, gray, gray, color.a);\n}\n\n\n",
        "defines": [
          {
            "name": "_USE_ETC1_TEXTURE",
            "type": "boolean",
            "defines": []
          }
        ],
        "uniforms": [
          {
            "name": "texture",
            "type": 13,
            "defines": []
          }
        ],
        "attributes": [
          {
            "name": "a_position",
            "type": 6,
            "defines": []
          },
          {
            "name": "a_uv0",
            "type": 5,
            "defines": []
          }
        ],
        "extensions": [],
        "name": "4c10e7ec534d3f65baabc458cc91fd8dfe66821a283acb75aea070ac"
      }
    ]
  },
  {
    "__type__": "cc.EffectAsset",
    "_name": "builtin-2d-sprite",
    "properties": {
      "texture": {
        "type": 13,
        "value": null
      },
      "alphaThreshold": {
        "value": 0.5
      }
    },
    "techniques": [
      {
        "passes": [
          {
            "cullMode": 0,
            "blend": true,
            "program": "cea1abc1cddcfe17654f435ec4a977f72769819d4d7c0460b90eedb5"
          }
        ],
        "layer": 0,
        "stages": [
          "opaque"
        ],
        "queue": 0,
        "priority": 0
      }
    ],
    "shaders": [
      {
        "vert": "\n#define _IS_VERT_SHADER 1\n\nprecision highp float;\n\nuniform mat4 cc_matViewProj;\n\n#if _USE_MODEL\n  uniform mat4 cc_matWorld;\n#endif\n\nattribute vec3 a_position;\nattribute lowp vec4 a_color;\n\n#if USE_TEXTURE\n  attribute mediump vec2 a_uv0;\n  varying mediump vec2 v_uv0;\n#endif\n\nvarying lowp vec4 v_color;\n\nvoid main () {\n  mat4 mvp;\n  \n  #if _USE_MODEL\n    mvp = cc_matViewProj * cc_matWorld;\n  #else\n    mvp = cc_matViewProj;\n  #endif\n\n  #if USE_TEXTURE\n    v_uv0 = a_uv0;\n  #endif\n\n  v_color = a_color;\n\n  gl_Position = mvp * vec4(a_position, 1);\n}\n\n\n",
        "frag": "\n#define _IS_FRAG_SHADER 1\n\nprecision highp float;\n\n#if USE_TEXTURE\n  uniform sampler2D texture;\n  varying mediump vec2 v_uv0;\n#endif\n\n#if USE_ALPHA_TEST\n  uniform float alphaThreshold;\n#endif\n\nvoid ALPHA_TEST (in vec4 color) {\n  #if USE_ALPHA_TEST\n      if (color.a < alphaThreshold) discard;\n  #endif\n}\n\nvoid ALPHA_TEST (in float alpha) {\n  #if USE_ALPHA_TEST\n      if (alpha < alphaThreshold) discard;\n  #endif\n}\n\nvarying lowp vec4 v_color;\n\nvoid main () {\n  vec4 color = v_color;\n\n  #if USE_TEXTURE\n    color *= texture2D(texture, v_uv0);\n    #if _USE_ETC1_TEXTURE\n      color.a *= texture2D(texture, v_uv0 + vec2(0, 0.5)).r;\n    #endif\n  #endif\n\n  ALPHA_TEST(color);\n\n  gl_FragColor = color;\n}\n\n\n",
        "defines": [
          {
            "name": "_USE_MODEL",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "USE_TEXTURE",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "USE_ALPHA_TEST",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_ETC1_TEXTURE",
            "type": "boolean",
            "defines": [
              "USE_TEXTURE"
            ]
          }
        ],
        "uniforms": [
          {
            "name": "texture",
            "type": 13,
            "defines": [
              "USE_TEXTURE"
            ]
          },
          {
            "name": "alphaThreshold",
            "type": 4,
            "property": true,
            "defines": [
              "USE_ALPHA_TEST"
            ]
          }
        ],
        "attributes": [
          {
            "name": "a_position",
            "type": 6,
            "defines": []
          },
          {
            "name": "a_color",
            "type": 7,
            "defines": []
          },
          {
            "name": "a_uv0",
            "type": 5,
            "defines": [
              "USE_TEXTURE"
            ]
          }
        ],
        "extensions": [],
        "name": "cea1abc1cddcfe17654f435ec4a977f72769819d4d7c0460b90eedb5"
      }
    ]
  },
  {
    "__type__": "cc.Material",
    "_name": "builtin-unlit",
    "_effectAsset": {
      "__uuid__": "6dkeWRTOBGXICfYQ7JUBnG"
    },
    "_defines": {
      "USE_DIFFUSE_TEXTURE": true
    },
    "_props": {
      "diffuseTexture": {
        "__uuid__": "02delMVqdBD70a/HSD99FK"
      }
    }
  },
  {
    "__type__": "cc.Material",
    "_name": "builtin-2d-gray-sprite",
    "_effectAsset": {
      "__uuid__": "14TDKXr2NJ6LjvHPops74o"
    },
    "_defines": {},
    "_props": {}
  },
  {
    "__type__": "cc.SpriteFrame",
    "content": {
      "name": "bg1",
      "texture": "d5M9rfnhRE0ZXWh3zUhdGI",
      "rect": [
        0,
        0,
        100,
        100
      ],
      "offset": [
        0,
        0
      ],
      "originalSize": [
        100,
        100
      ],
      "capInsets": [
        0,
        0,
        0,
        0
      ]
    }
  },
  {
    "__type__": "cc.EffectAsset",
    "_name": "builtin-unlit",
    "properties": {
      "diffuseTexture": {
        "type": 13,
        "value": null
      },
      "diffuseColor": {
        "type": 9,
        "value": [
          1,
          1,
          1,
          1
        ]
      },
      "alphaThreshold": {
        "value": 0.5
      }
    },
    "techniques": [
      {
        "passes": [
          {
            "cullMode": 0,
            "depthTest": true,
            "depthWrite": true,
            "blend": true,
            "program": "8af5ee8040d8725057e4d5f8bac775803dac5e5263fc2495a0b4cc79"
          }
        ],
        "layer": 0,
        "stages": [
          "opaque"
        ],
        "queue": 0,
        "priority": 0
      }
    ],
    "shaders": [
      {
        "vert": "\n#define _IS_VERT_SHADER 1\n\nprecision highp float;\n\nuniform mat4 cc_matWorld;\nuniform mat3 cc_matWorldIT;\n\nuniform mat4 cc_matView;\n\nuniform mat4 cc_matViewProj;\n\nuniform vec3 cc_cameraPos;                       \n\nuniform vec3 cc_sceneAmbient;                    \n\n#ifndef USE_DIFFUSE_TEXTURE\n  #ifndef USE_EMISSIVE_TEXTURE\n    #ifndef USE_SPECULAR_TEXTURE\n      #ifndef USE_NORMAL_TEXTURE\n        #define _NOT_USE_TEXTURE 1\n      #endif\n    #endif\n  #endif\n#endif\n\n#if USE_TILING_OFFSET && _USE_ATTRIBUTE_UV0\n  uniform vec2 mainTiling;\n  uniform vec2 mainOffset;\n#endif\n\n#ifdef _IS_VERT_SHADER\n  attribute vec3 a_position;\n#endif\n\n#ifndef _NOT_USE_TEXTURE\n\n  #if _USE_ATTRIBUTE_UV0\n    #ifdef _IS_VERT_SHADER\n      attribute mediump vec2 a_uv0;\n    #endif\n\n    varying mediump vec2 v_uv0;\n  #endif\n\n#endif\n\n#if _USE_ATTRIBUTE_COLOR\n\n  #ifdef _IS_VERT_SHADER\n    attribute lowp vec4 a_color;\n  #endif\n\n  varying lowp vec4 v_color;\n#endif\n\n#if _USE_ATTRIBUTE_NORMAL\n  #ifdef _IS_VERT_SHADER\n    attribute vec3 a_normal;\n  #endif\n#endif\n\n#ifdef _IS_VERT_SHADER\n\n  void ATTRIBUTE_TO_VARYING () {\n\n    #if _USE_ATTRIBUTE_COLOR\n        v_color = a_color;\n    #endif\n\n    #ifndef _NOT_USE_TEXTURE\n      #if _USE_ATTRIBUTE_UV0\n        v_uv0 = a_uv0;\n\n        #if USE_TILING_OFFSET\n          v_uv0 = v_uv0 * mainTiling + mainOffset;\n        #endif\n      #endif\n    #endif\n\n  }\n\n#endif\n\nvoid MUL_ATTR_COLOR (inout vec4 color) {\n  #if _USE_ATTRIBUTE_COLOR\n    #ifdef _IS_VERT_SHADER\n      color *= a_color;\n    #else\n      color *= v_color;\n    #endif\n  #endif\n}\n\nvoid MUL_ATTR_NORMAL (inout vec3 normal) {\n  #if _USE_ATTRIBUTE_NORMAL\n    #ifdef _IS_VERT_SHADER\n      normal *= a_normal;\n    #endif\n  #endif\n}\nvoid MUL_ATTR_NORMAL (inout vec4 normal) {\n  #if _USE_ATTRIBUTE_NORMAL\n    #ifdef _IS_VERT_SHADER\n      normal.xyz *= a_normal;\n    #endif\n  #endif\n}\n\n#if _USE_SKINNING\n\n  attribute vec4 a_weights;\n  attribute vec4 a_joints;\n\n  #if _USE_JOINTS_TEXTRUE\n    uniform sampler2D _jointsTexture;\n    uniform vec2 _jointsTextureSize;\n\n    #if _JOINTS_TEXTURE_FLOAT32\n      mat4 getBoneMatrix(const in float i) {\n        float width = _jointsTextureSize.x;\n        float height = _jointsTextureSize.y;\n        float j = i * 4.0;\n        float x = mod(j, width);\n        float y = floor(j / width);\n\n        float dx = 1.0 / width;\n        float dy = 1.0 / height;\n\n        y = dy * (y + 0.5);\n\n        vec4 v1 = texture2D(_jointsTexture, vec2(dx * (x + 0.5), y));\n        vec4 v2 = texture2D(_jointsTexture, vec2(dx * (x + 1.5), y));\n        vec4 v3 = texture2D(_jointsTexture, vec2(dx * (x + 2.5), y));\n        vec4 v4 = texture2D(_jointsTexture, vec2(dx * (x + 3.5), y));\n\n        return mat4(v1, v2, v3, v4);\n      }\n    #else\n      float decode32(vec4 rgba) {\n        float Sign = 1.0 - step(128.0, rgba[0]) * 2.0;\n        float Exponent = 2.0 * mod(rgba[0], 128.0) + step(128.0, rgba[1]) - 127.0;\n        float Mantissa = mod(rgba[1], 128.0) * 65536.0 + rgba[2] * 256.0 + rgba[3] + 8388608.0;\n        return Sign * exp2(Exponent - 23.0) * Mantissa;\n      }\n      vec4 decodevec4 (vec4 x, vec4 y, vec4 z, vec4 w) {\n        \n        return vec4(\n          decode32(x.wzyx * 255.0),\n          decode32(y.wzyx * 255.0),\n          decode32(z.wzyx * 255.0),\n          decode32(w.wzyx * 255.0)\n        );\n      }\n\n      vec4 decodevec4 (float dx, float x, float y) {\n        return decodevec4(\n          texture2D(_jointsTexture, vec2(dx * (x + 0.5), y)),\n          texture2D(_jointsTexture, vec2(dx * (x + 1.5), y)),\n          texture2D(_jointsTexture, vec2(dx * (x + 2.5), y)),\n          texture2D(_jointsTexture, vec2(dx * (x + 3.5), y))\n        );\n      }\n\n      mat4 getBoneMatrix(const in float i) {\n        float width = _jointsTextureSize.x;\n        float height = _jointsTextureSize.y;\n        float j = i * 16.0;\n        float x = mod(j, width);\n        float y = floor(j / width);\n\n        float dx = 1.0 / width;\n        float dy = 1.0 / height;\n\n        y = dy * (y + 0.5);\n\n        vec4 v1 = decodevec4(dx, x,       y);\n        vec4 v2 = decodevec4(dx, x+4.0,   y);\n        vec4 v3 = decodevec4(dx, x+8.0,   y);\n        vec4 v4 = decodevec4(dx, x+12.0,  y);\n\n        return mat4(v1, v2, v3, v4);\n      }\n    #endif\n  #else\n    const int _JOINT_MATRICES_SIZE = 50;\n    uniform mat4 _jointMatrices[_JOINT_MATRICES_SIZE];\n\n    mat4 getBoneMatrix(const in float i) {\n      return _jointMatrices[int(i)];\n    }\n  #endif\n\n    mat4 skinMatrix() {\n      return\n        getBoneMatrix(a_joints.x) * a_weights.x +\n        getBoneMatrix(a_joints.y) * a_weights.y +\n        getBoneMatrix(a_joints.z) * a_weights.z +\n        getBoneMatrix(a_joints.w) * a_weights.w\n        ;\n    }\n#endif\n\nvoid SKIN_VERTEX(inout vec4 a1) {\n  #if _USE_SKINNING\n    mat4 m = skinMatrix();\n    a1 = m * a1;\n  #endif\n}\n\nvoid SKIN_VERTEX(inout vec4 a1, inout vec4 a2) {\n  #if _USE_SKINNING\n    mat4 m = skinMatrix();\n    a1 = m * a1;\n    a2 = m * a2;\n  #endif\n}\n\nvoid SKIN_VERTEX(inout vec4 a1, inout vec4 a2, inout vec4 a3) {\n  #if _USE_SKINNING\n    mat4 m = skinMatrix();\n    a1 = m * a1;\n    a2 = m * a2;\n    a3 = m * a3;\n  #endif\n}\n\nvoid main () {\n  vec4 position = vec4(a_position, 1);\n\n  SKIN_VERTEX(position);\n  ATTRIBUTE_TO_VARYING();\n\n  gl_Position = cc_matViewProj * cc_matWorld * position;\n}\n\n\n",
        "frag": "\n#define _IS_FRAG_SHADER 1\n\nprecision highp float;\n\n#ifndef USE_DIFFUSE_TEXTURE\n  #ifndef USE_EMISSIVE_TEXTURE\n    #ifndef USE_SPECULAR_TEXTURE\n      #ifndef USE_NORMAL_TEXTURE\n        #define _NOT_USE_TEXTURE 1\n      #endif\n    #endif\n  #endif\n#endif\n\n#if USE_TILING_OFFSET && _USE_ATTRIBUTE_UV0\n  uniform vec2 mainTiling;\n  uniform vec2 mainOffset;\n#endif\n\n#ifdef _IS_VERT_SHADER\n  attribute vec3 a_position;\n#endif\n\n#ifndef _NOT_USE_TEXTURE\n\n  #if _USE_ATTRIBUTE_UV0\n    #ifdef _IS_VERT_SHADER\n      attribute mediump vec2 a_uv0;\n    #endif\n\n    varying mediump vec2 v_uv0;\n  #endif\n\n#endif\n\n#if _USE_ATTRIBUTE_COLOR\n\n  #ifdef _IS_VERT_SHADER\n    attribute lowp vec4 a_color;\n  #endif\n\n  varying lowp vec4 v_color;\n#endif\n\n#if _USE_ATTRIBUTE_NORMAL\n  #ifdef _IS_VERT_SHADER\n    attribute vec3 a_normal;\n  #endif\n#endif\n\n#ifdef _IS_VERT_SHADER\n\n  void ATTRIBUTE_TO_VARYING () {\n\n    #if _USE_ATTRIBUTE_COLOR\n        v_color = a_color;\n    #endif\n\n    #ifndef _NOT_USE_TEXTURE\n      #if _USE_ATTRIBUTE_UV0\n        v_uv0 = a_uv0;\n\n        #if USE_TILING_OFFSET\n          v_uv0 = v_uv0 * mainTiling + mainOffset;\n        #endif\n      #endif\n    #endif\n\n  }\n\n#endif\n\nvoid MUL_ATTR_COLOR (inout vec4 color) {\n  #if _USE_ATTRIBUTE_COLOR\n    #ifdef _IS_VERT_SHADER\n      color *= a_color;\n    #else\n      color *= v_color;\n    #endif\n  #endif\n}\n\nvoid MUL_ATTR_NORMAL (inout vec3 normal) {\n  #if _USE_ATTRIBUTE_NORMAL\n    #ifdef _IS_VERT_SHADER\n      normal *= a_normal;\n    #endif\n  #endif\n}\nvoid MUL_ATTR_NORMAL (inout vec4 normal) {\n  #if _USE_ATTRIBUTE_NORMAL\n    #ifdef _IS_VERT_SHADER\n      normal.xyz *= a_normal;\n    #endif\n  #endif\n}\n\nvec3 gammaToLinearSpaceRGB(in vec3 sRGB) { \n  return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);\n}\n\nvec3 linearToGammaSpaceRGB(in vec3 RGB) { \n  vec3 S1 = sqrt(RGB);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;\n}\n\nvec4 gammaToLinearSpaceRGBA(in vec4 sRGBA) {\n  return vec4(gammaToLinearSpaceRGB(sRGBA.rgb), sRGBA.a);\n}\n\nvec4 linearToGammaSpaceRGBA(in vec4 RGBA) {\n  return vec4(linearToGammaSpaceRGB(RGBA.rgb), RGBA.a);\n}\n\nvec4 linearToLinear (in vec4 value) {\n  return value;\n}\n\n#if INPUT_IS_GAMMA\n  #define TEXEL_TO_LINEAR gammaToLinearSpaceRGBA\n#else\n  #define TEXEL_TO_LINEAR linearToLinear\n#endif\n\n#if OUTPUT_TO_GAMMA\n  #define LINEAR_TO_OUTPUT_TEXEL linearToGammaSpaceRGBA\n#else\n  #define LINEAR_TO_OUTPUT_TEXEL linearToLinear\n#endif\n\nuniform lowp vec4 diffuseColor;\n\n#if USE_DIFFUSE_TEXTURE\n  uniform sampler2D diffuseTexture;\n#endif\n\nvoid MULTIPLY_DIFFUSE_TEXTRUE_COLOR (inout vec4 color, in vec2 uv) {\n  #if USE_DIFFUSE_TEXTURE && _USE_ATTRIBUTE_UV0\n    vec4 diffuseTextureColor = texture2D(diffuseTexture, uv);\n    #if _USE_ETC1_DIFFUSETEXTURE\n      diffuseTextureColor.a *= texture2D(diffuseTexture, uv + vec2(0, 0.5)).r;\n    #endif\n    color *= TEXEL_TO_LINEAR(diffuseTextureColor);\n  #endif\n}\n\nvoid MULTIPLY_DIFFUSE_TEXTRUE_COLOR (inout vec4 color) {\n  #if USE_DIFFUSE_TEXTURE && _USE_ATTRIBUTE_UV0\n    \n    #ifdef _IS_VERT_SHADER\n      vec2 uv = a_uv0;\n    #else\n      vec2 uv = v_uv0;\n    #endif\n\n    MULTIPLY_DIFFUSE_TEXTRUE_COLOR(color, uv);\n  #endif\n}\n\nvoid CALC_DIFFUSE (inout vec4 diffuse, in vec2 uv) {\n  diffuse = diffuseColor;\n\n  MUL_ATTR_COLOR(diffuse);\n  MULTIPLY_DIFFUSE_TEXTRUE_COLOR(diffuse, uv);\n}\n\nvoid CALC_DIFFUSE (inout vec4 diffuse) {\n  diffuse = diffuseColor;\n\n  MUL_ATTR_COLOR(diffuse);\n  MULTIPLY_DIFFUSE_TEXTRUE_COLOR(diffuse);\n}\n\n#if USE_ALPHA_TEST\n  uniform float alphaThreshold;\n#endif\n\nvoid ALPHA_TEST (in vec4 color) {\n  #if USE_ALPHA_TEST\n      if (color.a < alphaThreshold) discard;\n  #endif\n}\n\nvoid ALPHA_TEST (in float alpha) {\n  #if USE_ALPHA_TEST\n      if (alpha < alphaThreshold) discard;\n  #endif\n}\n\nvoid main () {\n  vec4 diffuse;\n  CALC_DIFFUSE(diffuse);\n  ALPHA_TEST(diffuse);\n  gl_FragColor = LINEAR_TO_OUTPUT_TEXEL( diffuse );\n}\n\n\n",
        "defines": [
          {
            "name": "USE_DIFFUSE_TEXTURE",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "USE_EMISSIVE_TEXTURE",
            "type": "boolean",
            "defines": [
              "USE_DIFFUSE_TEXTURE"
            ]
          },
          {
            "name": "USE_SPECULAR_TEXTURE",
            "type": "boolean",
            "defines": [
              "USE_DIFFUSE_TEXTURE",
              "USE_EMISSIVE_TEXTURE"
            ]
          },
          {
            "name": "USE_NORMAL_TEXTURE",
            "type": "boolean",
            "defines": [
              "USE_DIFFUSE_TEXTURE",
              "USE_EMISSIVE_TEXTURE",
              "USE_SPECULAR_TEXTURE"
            ]
          },
          {
            "name": "USE_TILING_OFFSET",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_ATTRIBUTE_UV0",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_ATTRIBUTE_COLOR",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_ATTRIBUTE_NORMAL",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_SKINNING",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_JOINTS_TEXTRUE",
            "type": "boolean",
            "defines": [
              "_USE_SKINNING"
            ]
          },
          {
            "name": "_JOINTS_TEXTURE_FLOAT32",
            "type": "boolean",
            "defines": [
              "_USE_SKINNING",
              "_USE_JOINTS_TEXTRUE"
            ]
          },
          {
            "name": "INPUT_IS_GAMMA",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "OUTPUT_TO_GAMMA",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_ETC1_DIFFUSETEXTURE",
            "type": "boolean",
            "defines": [
              "USE_DIFFUSE_TEXTURE",
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "USE_ALPHA_TEST",
            "type": "boolean",
            "defines": []
          }
        ],
        "uniforms": [
          {
            "name": "mainTiling",
            "type": 5,
            "property": true,
            "defines": [
              "USE_TILING_OFFSET",
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "mainOffset",
            "type": 5,
            "property": true,
            "defines": [
              "USE_TILING_OFFSET",
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "mainTiling",
            "type": 5,
            "property": true,
            "defines": [
              "USE_TILING_OFFSET",
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "mainOffset",
            "type": 5,
            "property": true,
            "defines": [
              "USE_TILING_OFFSET",
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "diffuseColor",
            "type": 9,
            "property": true,
            "defines": []
          },
          {
            "name": "diffuseTexture",
            "type": 13,
            "property": true,
            "defines": [
              "USE_DIFFUSE_TEXTURE"
            ]
          },
          {
            "name": "alphaThreshold",
            "type": 4,
            "property": true,
            "defines": [
              "USE_ALPHA_TEST"
            ]
          }
        ],
        "attributes": [
          {
            "name": "a_position",
            "type": 6,
            "defines": []
          },
          {
            "name": "a_uv0",
            "type": 5,
            "defines": [
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "a_color",
            "type": 7,
            "defines": [
              "_USE_ATTRIBUTE_COLOR"
            ]
          },
          {
            "name": "a_normal",
            "type": 6,
            "defines": [
              "_USE_ATTRIBUTE_NORMAL"
            ]
          },
          {
            "name": "a_weights",
            "type": 7,
            "defines": [
              "_USE_SKINNING"
            ]
          },
          {
            "name": "a_joints",
            "type": 7,
            "defines": [
              "_USE_SKINNING"
            ]
          },
          {
            "name": "a_position",
            "type": 6,
            "defines": []
          },
          {
            "name": "a_uv0",
            "type": 5,
            "defines": [
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "a_color",
            "type": 7,
            "defines": [
              "_USE_ATTRIBUTE_COLOR"
            ]
          },
          {
            "name": "a_normal",
            "type": 6,
            "defines": [
              "_USE_ATTRIBUTE_NORMAL"
            ]
          }
        ],
        "extensions": [],
        "name": "8af5ee8040d8725057e4d5f8bac775803dac5e5263fc2495a0b4cc79"
      }
    ]
  },
  {
    "__type__": "cc.Texture2D",
    "content": "0,9729,9729,33071,33071,0,0,1"
  },
  {
    "__type__": "cc.Material",
    "_name": "builtin-2d-base",
    "_effectAsset": {
      "__uuid__": "28dPjdQWxEQIG3VVl1Qm6T"
    },
    "_defines": {},
    "_props": {}
  },
  [
    {
      "__type__": "cc.SceneAsset",
      "_name": "home",
      "scene": {
        "__id__": 1
      },
      "asyncLoadAssets": null
    },
    {
      "__type__": "cc.Scene",
      "_name": "New Node",
      "_children": [
        {
          "__id__": 2
        }
      ],
      "_active": false,
      "_anchorPoint": {
        "__type__": "cc.Vec2"
      },
      "autoReleaseAssets": false
    },
    {
      "__type__": "cc.Node",
      "_name": "Canvas",
      "_parent": {
        "__id__": 1
      },
      "_children": [
        {
          "__id__": 3
        },
        {
          "__id__": 4
        }
      ],
      "_level": 1,
      "_components": [
        {
          "__type__": "cc.Canvas",
          "node": {
            "__id__": 2
          },
          "_designResolution": {
            "__type__": "cc.Size",
            "width": 450,
            "height": 700
          },
          "_fitWidth": true
        }
      ],
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 450,
        "height": 700
      },
      "_position": {
        "__type__": "cc.Vec3",
        "x": 225,
        "y": 350
      },
      "_id": "d98mba629LrZyv0mhARjKb"
    },
    {
      "__type__": "cc.Node",
      "_name": "Main Camera",
      "_parent": {
        "__id__": 2
      },
      "_level": 2,
      "_components": [
        {
          "__type__": "cc.Camera",
          "node": {
            "__id__": 3
          },
          "_clearFlags": 7,
          "_depth": -1
        }
      ],
      "_position": {
        "__type__": "cc.Vec3",
        "z": 258.26379981553066
      }
    },
    {
      "__type__": "cc.Node",
      "_name": "rainkingList",
      "_parent": {
        "__id__": 2
      },
      "_children": [
        {
          "__id__": 5
        }
      ],
      "_level": 2,
      "_components": [
        {
          "__type__": "cc.Sprite",
          "node": {
            "__id__": 4
          },
          "_materials": [
            {
              "__uuid__": "ecpdLyjvZBwrvm+cedCcQy"
            }
          ],
          "_spriteFrame": {
            "__uuid__": "52YGe9njhOHLP5JhnBvhZT"
          },
          "_sizeMode": 0
        },
        {
          "__type__": "cc.Layout",
          "node": {
            "__id__": 4
          },
          "_N$layoutType": 2
        },
        {
          "__type__": "cc.Widget",
          "node": {
            "__id__": 4
          },
          "_alignFlags": 18
        },
        {
          "__type__": "0cf12LQGqVCppMu+uU3y01c",
          "node": {
            "__id__": 4
          },
          "userBlockPre": {
            "__uuid__": "b5GMVvLH5E26y+XrNUq++o"
          }
        }
      ],
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 450,
        "height": 700
      }
    },
    {
      "__type__": "cc.Node",
      "_name": "title",
      "_parent": {
        "__id__": 4
      },
      "_children": [
        {
          "__id__": 6
        }
      ],
      "_level": 3,
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 450,
        "height": 60
      },
      "_position": {
        "__type__": "cc.Vec3",
        "y": 320
      }
    },
    {
      "__type__": "cc.Node",
      "_name": "title",
      "_parent": {
        "__id__": 5
      },
      "_level": 4,
      "_components": [
        {
          "__type__": "cc.Label",
          "node": {
            "__id__": 6
          },
          "_materials": [
            {
              "__uuid__": "ecpdLyjvZBwrvm+cedCcQy"
            }
          ],
          "_useOriginalSize": false,
          "_string": "好友排行榜",
          "_N$string": "好友排行榜",
          "_N$horizontalAlign": 1,
          "_N$verticalAlign": 1
        }
      ],
      "_color": {
        "__type__": "cc.Color"
      },
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 200,
        "height": 50.4
      }
    }
  ],
  {
    "__type__": "cc.EffectAsset",
    "_name": "builtin-unlit-transparent",
    "properties": {
      "diffuseTexture": {
        "type": 13,
        "value": null
      },
      "diffuseColor": {
        "type": 9,
        "value": [
          1,
          1,
          1,
          1
        ]
      }
    },
    "techniques": [
      {
        "stages": [
          "transparent"
        ],
        "passes": [
          {
            "depthTest": true,
            "depthWrite": false,
            "blend": true,
            "blendEq": 32774,
            "blendSrc": 770,
            "blendDst": 771,
            "blendAlphaEq": 32774,
            "blendSrcAlpha": 1,
            "blendDstAlpha": 771,
            "program": "8af5ee8040d8725057e4d5f8bac775803dac5e5263fc2495a0b4cc79"
          }
        ],
        "layer": 0,
        "queue": 0,
        "priority": 0
      }
    ],
    "shaders": [
      {
        "vert": "\n#define _IS_VERT_SHADER 1\n\nprecision highp float;\n\nuniform mat4 cc_matWorld;\nuniform mat3 cc_matWorldIT;\n\nuniform mat4 cc_matView;\n\nuniform mat4 cc_matViewProj;\n\nuniform vec3 cc_cameraPos;                       \n\nuniform vec3 cc_sceneAmbient;                    \n\n#ifndef USE_DIFFUSE_TEXTURE\n  #ifndef USE_EMISSIVE_TEXTURE\n    #ifndef USE_SPECULAR_TEXTURE\n      #ifndef USE_NORMAL_TEXTURE\n        #define _NOT_USE_TEXTURE 1\n      #endif\n    #endif\n  #endif\n#endif\n\n#if USE_TILING_OFFSET && _USE_ATTRIBUTE_UV0\n  uniform vec2 mainTiling;\n  uniform vec2 mainOffset;\n#endif\n\n#ifdef _IS_VERT_SHADER\n  attribute vec3 a_position;\n#endif\n\n#ifndef _NOT_USE_TEXTURE\n\n  #if _USE_ATTRIBUTE_UV0\n    #ifdef _IS_VERT_SHADER\n      attribute mediump vec2 a_uv0;\n    #endif\n\n    varying mediump vec2 v_uv0;\n  #endif\n\n#endif\n\n#if _USE_ATTRIBUTE_COLOR\n\n  #ifdef _IS_VERT_SHADER\n    attribute lowp vec4 a_color;\n  #endif\n\n  varying lowp vec4 v_color;\n#endif\n\n#if _USE_ATTRIBUTE_NORMAL\n  #ifdef _IS_VERT_SHADER\n    attribute vec3 a_normal;\n  #endif\n#endif\n\n#ifdef _IS_VERT_SHADER\n\n  void ATTRIBUTE_TO_VARYING () {\n\n    #if _USE_ATTRIBUTE_COLOR\n        v_color = a_color;\n    #endif\n\n    #ifndef _NOT_USE_TEXTURE\n      #if _USE_ATTRIBUTE_UV0\n        v_uv0 = a_uv0;\n\n        #if USE_TILING_OFFSET\n          v_uv0 = v_uv0 * mainTiling + mainOffset;\n        #endif\n      #endif\n    #endif\n\n  }\n\n#endif\n\nvoid MUL_ATTR_COLOR (inout vec4 color) {\n  #if _USE_ATTRIBUTE_COLOR\n    #ifdef _IS_VERT_SHADER\n      color *= a_color;\n    #else\n      color *= v_color;\n    #endif\n  #endif\n}\n\nvoid MUL_ATTR_NORMAL (inout vec3 normal) {\n  #if _USE_ATTRIBUTE_NORMAL\n    #ifdef _IS_VERT_SHADER\n      normal *= a_normal;\n    #endif\n  #endif\n}\nvoid MUL_ATTR_NORMAL (inout vec4 normal) {\n  #if _USE_ATTRIBUTE_NORMAL\n    #ifdef _IS_VERT_SHADER\n      normal.xyz *= a_normal;\n    #endif\n  #endif\n}\n\n#if _USE_SKINNING\n\n  attribute vec4 a_weights;\n  attribute vec4 a_joints;\n\n  #if _USE_JOINTS_TEXTRUE\n    uniform sampler2D _jointsTexture;\n    uniform vec2 _jointsTextureSize;\n\n    #if _JOINTS_TEXTURE_FLOAT32\n      mat4 getBoneMatrix(const in float i) {\n        float width = _jointsTextureSize.x;\n        float height = _jointsTextureSize.y;\n        float j = i * 4.0;\n        float x = mod(j, width);\n        float y = floor(j / width);\n\n        float dx = 1.0 / width;\n        float dy = 1.0 / height;\n\n        y = dy * (y + 0.5);\n\n        vec4 v1 = texture2D(_jointsTexture, vec2(dx * (x + 0.5), y));\n        vec4 v2 = texture2D(_jointsTexture, vec2(dx * (x + 1.5), y));\n        vec4 v3 = texture2D(_jointsTexture, vec2(dx * (x + 2.5), y));\n        vec4 v4 = texture2D(_jointsTexture, vec2(dx * (x + 3.5), y));\n\n        return mat4(v1, v2, v3, v4);\n      }\n    #else\n      float decode32(vec4 rgba) {\n        float Sign = 1.0 - step(128.0, rgba[0]) * 2.0;\n        float Exponent = 2.0 * mod(rgba[0], 128.0) + step(128.0, rgba[1]) - 127.0;\n        float Mantissa = mod(rgba[1], 128.0) * 65536.0 + rgba[2] * 256.0 + rgba[3] + 8388608.0;\n        return Sign * exp2(Exponent - 23.0) * Mantissa;\n      }\n      vec4 decodevec4 (vec4 x, vec4 y, vec4 z, vec4 w) {\n        \n        return vec4(\n          decode32(x.wzyx * 255.0),\n          decode32(y.wzyx * 255.0),\n          decode32(z.wzyx * 255.0),\n          decode32(w.wzyx * 255.0)\n        );\n      }\n\n      vec4 decodevec4 (float dx, float x, float y) {\n        return decodevec4(\n          texture2D(_jointsTexture, vec2(dx * (x + 0.5), y)),\n          texture2D(_jointsTexture, vec2(dx * (x + 1.5), y)),\n          texture2D(_jointsTexture, vec2(dx * (x + 2.5), y)),\n          texture2D(_jointsTexture, vec2(dx * (x + 3.5), y))\n        );\n      }\n\n      mat4 getBoneMatrix(const in float i) {\n        float width = _jointsTextureSize.x;\n        float height = _jointsTextureSize.y;\n        float j = i * 16.0;\n        float x = mod(j, width);\n        float y = floor(j / width);\n\n        float dx = 1.0 / width;\n        float dy = 1.0 / height;\n\n        y = dy * (y + 0.5);\n\n        vec4 v1 = decodevec4(dx, x,       y);\n        vec4 v2 = decodevec4(dx, x+4.0,   y);\n        vec4 v3 = decodevec4(dx, x+8.0,   y);\n        vec4 v4 = decodevec4(dx, x+12.0,  y);\n\n        return mat4(v1, v2, v3, v4);\n      }\n    #endif\n  #else\n    const int _JOINT_MATRICES_SIZE = 50;\n    uniform mat4 _jointMatrices[_JOINT_MATRICES_SIZE];\n\n    mat4 getBoneMatrix(const in float i) {\n      return _jointMatrices[int(i)];\n    }\n  #endif\n\n    mat4 skinMatrix() {\n      return\n        getBoneMatrix(a_joints.x) * a_weights.x +\n        getBoneMatrix(a_joints.y) * a_weights.y +\n        getBoneMatrix(a_joints.z) * a_weights.z +\n        getBoneMatrix(a_joints.w) * a_weights.w\n        ;\n    }\n#endif\n\nvoid SKIN_VERTEX(inout vec4 a1) {\n  #if _USE_SKINNING\n    mat4 m = skinMatrix();\n    a1 = m * a1;\n  #endif\n}\n\nvoid SKIN_VERTEX(inout vec4 a1, inout vec4 a2) {\n  #if _USE_SKINNING\n    mat4 m = skinMatrix();\n    a1 = m * a1;\n    a2 = m * a2;\n  #endif\n}\n\nvoid SKIN_VERTEX(inout vec4 a1, inout vec4 a2, inout vec4 a3) {\n  #if _USE_SKINNING\n    mat4 m = skinMatrix();\n    a1 = m * a1;\n    a2 = m * a2;\n    a3 = m * a3;\n  #endif\n}\n\nvoid main () {\n  vec4 position = vec4(a_position, 1);\n\n  SKIN_VERTEX(position);\n  ATTRIBUTE_TO_VARYING();\n\n  gl_Position = cc_matViewProj * cc_matWorld * position;\n}\n\n\n",
        "frag": "\n#define _IS_FRAG_SHADER 1\n\nprecision highp float;\n\n#ifndef USE_DIFFUSE_TEXTURE\n  #ifndef USE_EMISSIVE_TEXTURE\n    #ifndef USE_SPECULAR_TEXTURE\n      #ifndef USE_NORMAL_TEXTURE\n        #define _NOT_USE_TEXTURE 1\n      #endif\n    #endif\n  #endif\n#endif\n\n#if USE_TILING_OFFSET && _USE_ATTRIBUTE_UV0\n  uniform vec2 mainTiling;\n  uniform vec2 mainOffset;\n#endif\n\n#ifdef _IS_VERT_SHADER\n  attribute vec3 a_position;\n#endif\n\n#ifndef _NOT_USE_TEXTURE\n\n  #if _USE_ATTRIBUTE_UV0\n    #ifdef _IS_VERT_SHADER\n      attribute mediump vec2 a_uv0;\n    #endif\n\n    varying mediump vec2 v_uv0;\n  #endif\n\n#endif\n\n#if _USE_ATTRIBUTE_COLOR\n\n  #ifdef _IS_VERT_SHADER\n    attribute lowp vec4 a_color;\n  #endif\n\n  varying lowp vec4 v_color;\n#endif\n\n#if _USE_ATTRIBUTE_NORMAL\n  #ifdef _IS_VERT_SHADER\n    attribute vec3 a_normal;\n  #endif\n#endif\n\n#ifdef _IS_VERT_SHADER\n\n  void ATTRIBUTE_TO_VARYING () {\n\n    #if _USE_ATTRIBUTE_COLOR\n        v_color = a_color;\n    #endif\n\n    #ifndef _NOT_USE_TEXTURE\n      #if _USE_ATTRIBUTE_UV0\n        v_uv0 = a_uv0;\n\n        #if USE_TILING_OFFSET\n          v_uv0 = v_uv0 * mainTiling + mainOffset;\n        #endif\n      #endif\n    #endif\n\n  }\n\n#endif\n\nvoid MUL_ATTR_COLOR (inout vec4 color) {\n  #if _USE_ATTRIBUTE_COLOR\n    #ifdef _IS_VERT_SHADER\n      color *= a_color;\n    #else\n      color *= v_color;\n    #endif\n  #endif\n}\n\nvoid MUL_ATTR_NORMAL (inout vec3 normal) {\n  #if _USE_ATTRIBUTE_NORMAL\n    #ifdef _IS_VERT_SHADER\n      normal *= a_normal;\n    #endif\n  #endif\n}\nvoid MUL_ATTR_NORMAL (inout vec4 normal) {\n  #if _USE_ATTRIBUTE_NORMAL\n    #ifdef _IS_VERT_SHADER\n      normal.xyz *= a_normal;\n    #endif\n  #endif\n}\n\nvec3 gammaToLinearSpaceRGB(in vec3 sRGB) { \n  return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);\n}\n\nvec3 linearToGammaSpaceRGB(in vec3 RGB) { \n  vec3 S1 = sqrt(RGB);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;\n}\n\nvec4 gammaToLinearSpaceRGBA(in vec4 sRGBA) {\n  return vec4(gammaToLinearSpaceRGB(sRGBA.rgb), sRGBA.a);\n}\n\nvec4 linearToGammaSpaceRGBA(in vec4 RGBA) {\n  return vec4(linearToGammaSpaceRGB(RGBA.rgb), RGBA.a);\n}\n\nvec4 linearToLinear (in vec4 value) {\n  return value;\n}\n\n#if INPUT_IS_GAMMA\n  #define TEXEL_TO_LINEAR gammaToLinearSpaceRGBA\n#else\n  #define TEXEL_TO_LINEAR linearToLinear\n#endif\n\n#if OUTPUT_TO_GAMMA\n  #define LINEAR_TO_OUTPUT_TEXEL linearToGammaSpaceRGBA\n#else\n  #define LINEAR_TO_OUTPUT_TEXEL linearToLinear\n#endif\n\nuniform lowp vec4 diffuseColor;\n\n#if USE_DIFFUSE_TEXTURE\n  uniform sampler2D diffuseTexture;\n#endif\n\nvoid MULTIPLY_DIFFUSE_TEXTRUE_COLOR (inout vec4 color, in vec2 uv) {\n  #if USE_DIFFUSE_TEXTURE && _USE_ATTRIBUTE_UV0\n    vec4 diffuseTextureColor = texture2D(diffuseTexture, uv);\n    #if _USE_ETC1_DIFFUSETEXTURE\n      diffuseTextureColor.a *= texture2D(diffuseTexture, uv + vec2(0, 0.5)).r;\n    #endif\n    color *= TEXEL_TO_LINEAR(diffuseTextureColor);\n  #endif\n}\n\nvoid MULTIPLY_DIFFUSE_TEXTRUE_COLOR (inout vec4 color) {\n  #if USE_DIFFUSE_TEXTURE && _USE_ATTRIBUTE_UV0\n    \n    #ifdef _IS_VERT_SHADER\n      vec2 uv = a_uv0;\n    #else\n      vec2 uv = v_uv0;\n    #endif\n\n    MULTIPLY_DIFFUSE_TEXTRUE_COLOR(color, uv);\n  #endif\n}\n\nvoid CALC_DIFFUSE (inout vec4 diffuse, in vec2 uv) {\n  diffuse = diffuseColor;\n\n  MUL_ATTR_COLOR(diffuse);\n  MULTIPLY_DIFFUSE_TEXTRUE_COLOR(diffuse, uv);\n}\n\nvoid CALC_DIFFUSE (inout vec4 diffuse) {\n  diffuse = diffuseColor;\n\n  MUL_ATTR_COLOR(diffuse);\n  MULTIPLY_DIFFUSE_TEXTRUE_COLOR(diffuse);\n}\n\n#if USE_ALPHA_TEST\n  uniform float alphaThreshold;\n#endif\n\nvoid ALPHA_TEST (in vec4 color) {\n  #if USE_ALPHA_TEST\n      if (color.a < alphaThreshold) discard;\n  #endif\n}\n\nvoid ALPHA_TEST (in float alpha) {\n  #if USE_ALPHA_TEST\n      if (alpha < alphaThreshold) discard;\n  #endif\n}\n\nvoid main () {\n  vec4 diffuse;\n  CALC_DIFFUSE(diffuse);\n  ALPHA_TEST(diffuse);\n  gl_FragColor = LINEAR_TO_OUTPUT_TEXEL( diffuse );\n}\n\n\n",
        "defines": [
          {
            "name": "USE_DIFFUSE_TEXTURE",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "USE_EMISSIVE_TEXTURE",
            "type": "boolean",
            "defines": [
              "USE_DIFFUSE_TEXTURE"
            ]
          },
          {
            "name": "USE_SPECULAR_TEXTURE",
            "type": "boolean",
            "defines": [
              "USE_DIFFUSE_TEXTURE",
              "USE_EMISSIVE_TEXTURE"
            ]
          },
          {
            "name": "USE_NORMAL_TEXTURE",
            "type": "boolean",
            "defines": [
              "USE_DIFFUSE_TEXTURE",
              "USE_EMISSIVE_TEXTURE",
              "USE_SPECULAR_TEXTURE"
            ]
          },
          {
            "name": "USE_TILING_OFFSET",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_ATTRIBUTE_UV0",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_ATTRIBUTE_COLOR",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_ATTRIBUTE_NORMAL",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_SKINNING",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_JOINTS_TEXTRUE",
            "type": "boolean",
            "defines": [
              "_USE_SKINNING"
            ]
          },
          {
            "name": "_JOINTS_TEXTURE_FLOAT32",
            "type": "boolean",
            "defines": [
              "_USE_SKINNING",
              "_USE_JOINTS_TEXTRUE"
            ]
          },
          {
            "name": "INPUT_IS_GAMMA",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "OUTPUT_TO_GAMMA",
            "type": "boolean",
            "defines": []
          },
          {
            "name": "_USE_ETC1_DIFFUSETEXTURE",
            "type": "boolean",
            "defines": [
              "USE_DIFFUSE_TEXTURE",
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "USE_ALPHA_TEST",
            "type": "boolean",
            "defines": []
          }
        ],
        "uniforms": [
          {
            "name": "mainTiling",
            "type": 5,
            "property": true,
            "defines": [
              "USE_TILING_OFFSET",
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "mainOffset",
            "type": 5,
            "property": true,
            "defines": [
              "USE_TILING_OFFSET",
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "mainTiling",
            "type": 5,
            "property": true,
            "defines": [
              "USE_TILING_OFFSET",
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "mainOffset",
            "type": 5,
            "property": true,
            "defines": [
              "USE_TILING_OFFSET",
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "diffuseColor",
            "type": 9,
            "property": true,
            "defines": []
          },
          {
            "name": "diffuseTexture",
            "type": 13,
            "property": true,
            "defines": [
              "USE_DIFFUSE_TEXTURE"
            ]
          },
          {
            "name": "alphaThreshold",
            "type": 4,
            "property": true,
            "defines": [
              "USE_ALPHA_TEST"
            ]
          }
        ],
        "attributes": [
          {
            "name": "a_position",
            "type": 6,
            "defines": []
          },
          {
            "name": "a_uv0",
            "type": 5,
            "defines": [
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "a_color",
            "type": 7,
            "defines": [
              "_USE_ATTRIBUTE_COLOR"
            ]
          },
          {
            "name": "a_normal",
            "type": 6,
            "defines": [
              "_USE_ATTRIBUTE_NORMAL"
            ]
          },
          {
            "name": "a_weights",
            "type": 7,
            "defines": [
              "_USE_SKINNING"
            ]
          },
          {
            "name": "a_joints",
            "type": 7,
            "defines": [
              "_USE_SKINNING"
            ]
          },
          {
            "name": "a_position",
            "type": 6,
            "defines": []
          },
          {
            "name": "a_uv0",
            "type": 5,
            "defines": [
              "_USE_ATTRIBUTE_UV0"
            ]
          },
          {
            "name": "a_color",
            "type": 7,
            "defines": [
              "_USE_ATTRIBUTE_COLOR"
            ]
          },
          {
            "name": "a_normal",
            "type": 6,
            "defines": [
              "_USE_ATTRIBUTE_NORMAL"
            ]
          }
        ],
        "extensions": [],
        "name": "8af5ee8040d8725057e4d5f8bac775803dac5e5263fc2495a0b4cc79"
      }
    ]
  },
  {
    "__type__": "cc.Material",
    "_name": "builtin-2d-spine",
    "_effectAsset": {
      "__uuid__": "0ek66qC1NOQLjgYmi04HvX"
    },
    "_defines": {},
    "_props": {}
  },
  {
    "__type__": "cc.SpriteFrame",
    "content": {
      "name": "default_sprite",
      "texture": "6eBWFz0oVHPLIGQKf/9Thu",
      "rect": [
        0,
        2,
        40,
        36
      ],
      "offset": [
        0,
        0
      ],
      "originalSize": [
        40,
        40
      ],
      "capInsets": [
        0,
        0,
        0,
        0
      ]
    }
  },
  {
    "__type__": "cc.Texture2D",
    "content": "0,9729,9729,33071,33071,0,0,1"
  },
  [
    {
      "__type__": "cc.Prefab",
      "_name": "userBlock",
      "data": {
        "__id__": 1
      }
    },
    {
      "__type__": "cc.Node",
      "_name": "userBlock",
      "_children": [
        {
          "__id__": 2
        },
        {
          "__id__": 3
        },
        {
          "__id__": 5
        },
        {
          "__id__": 7
        },
        {
          "__id__": 9
        }
      ],
      "_level": 1,
      "_components": [
        {
          "__type__": "5290ecID6pGnoqTDJgtiaCu",
          "node": {
            "__id__": 1
          },
          "no": {
            "__id__": 4
          },
          "image": {
            "__id__": 6
          },
          "username": {
            "__id__": 8
          },
          "score": {
            "__id__": 10
          }
        }
      ],
      "_prefab": {
        "__type__": "cc.PrefabInfo",
        "root": {
          "__id__": 1
        },
        "asset": {
          "__uuid__": "b5GMVvLH5E26y+XrNUq++o"
        },
        "fileId": "76daGghlhHoYcZSt4Pkvsk"
      },
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 450,
        "height": 60
      },
      "_position": {
        "__type__": "cc.Vec3",
        "y": 260
      }
    },
    {
      "__type__": "cc.Node",
      "_name": "bg",
      "_parent": {
        "__id__": 1
      },
      "_level": 4,
      "_components": [
        {
          "__type__": "cc.Sprite",
          "node": {
            "__id__": 2
          },
          "_materials": [
            {
              "__uuid__": "ecpdLyjvZBwrvm+cedCcQy"
            }
          ],
          "_spriteFrame": {
            "__uuid__": "ffBdVIbMRHe42pcwiFHZ3i"
          },
          "_sizeMode": 0
        }
      ],
      "_prefab": {
        "__type__": "cc.PrefabInfo",
        "root": {
          "__id__": 1
        },
        "asset": {
          "__uuid__": "b5GMVvLH5E26y+XrNUq++o"
        },
        "fileId": "62xSW2mBBNgY0MKaoesGDS"
      },
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 450,
        "height": 60
      }
    },
    {
      "__type__": "cc.Node",
      "_name": "no",
      "_parent": {
        "__id__": 1
      },
      "_level": 4,
      "_components": [
        {
          "__id__": 4
        }
      ],
      "_prefab": {
        "__type__": "cc.PrefabInfo",
        "root": {
          "__id__": 1
        },
        "asset": {
          "__uuid__": "b5GMVvLH5E26y+XrNUq++o"
        },
        "fileId": "f9zP+YijpK34HWhRZqrQdc"
      },
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 22.25,
        "height": 50.4
      },
      "_anchorPoint": {
        "__type__": "cc.Vec2",
        "y": 0.5
      },
      "_position": {
        "__type__": "cc.Vec3",
        "x": -204.335
      }
    },
    {
      "__type__": "cc.Label",
      "node": {
        "__id__": 3
      },
      "_materials": [
        {
          "__uuid__": "ecpdLyjvZBwrvm+cedCcQy"
        }
      ],
      "_useOriginalSize": false,
      "_string": "0",
      "_N$string": "0",
      "_N$verticalAlign": 1
    },
    {
      "__type__": "cc.Node",
      "_name": "image",
      "_parent": {
        "__id__": 1
      },
      "_level": 4,
      "_components": [
        {
          "__id__": 6
        }
      ],
      "_prefab": {
        "__type__": "cc.PrefabInfo",
        "root": {
          "__id__": 1
        },
        "asset": {
          "__uuid__": "b5GMVvLH5E26y+XrNUq++o"
        },
        "fileId": "80mjghx4lIn7BaR16d3Js1"
      },
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 55,
        "height": 55
      },
      "_position": {
        "__type__": "cc.Vec3",
        "x": -139.045
      }
    },
    {
      "__type__": "cc.Sprite",
      "node": {
        "__id__": 5
      },
      "_materials": [
        {
          "__uuid__": "ecpdLyjvZBwrvm+cedCcQy"
        }
      ],
      "_spriteFrame": {
        "__uuid__": "8c20Sso/ZEn7NUfNSM+EBh"
      },
      "_sizeMode": 0
    },
    {
      "__type__": "cc.Node",
      "_name": "userName",
      "_parent": {
        "__id__": 1
      },
      "_level": 4,
      "_components": [
        {
          "__id__": 8
        }
      ],
      "_prefab": {
        "__type__": "cc.PrefabInfo",
        "root": {
          "__id__": 1
        },
        "asset": {
          "__uuid__": "b5GMVvLH5E26y+XrNUq++o"
        },
        "fileId": "181HLRBzlDKrg23fg0qpuu"
      },
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 120,
        "height": 50.4
      },
      "_anchorPoint": {
        "__type__": "cc.Vec2",
        "y": 0.5
      },
      "_position": {
        "__type__": "cc.Vec3",
        "x": -97.025
      }
    },
    {
      "__type__": "cc.Label",
      "node": {
        "__id__": 7
      },
      "_materials": [
        {
          "__uuid__": "ecpdLyjvZBwrvm+cedCcQy"
        }
      ],
      "_useOriginalSize": false,
      "_string": "用户名",
      "_N$string": "用户名",
      "_N$verticalAlign": 1
    },
    {
      "__type__": "cc.Node",
      "_name": "score",
      "_parent": {
        "__id__": 1
      },
      "_level": 4,
      "_components": [
        {
          "__id__": 10
        }
      ],
      "_prefab": {
        "__type__": "cc.PrefabInfo",
        "root": {
          "__id__": 1
        },
        "asset": {
          "__uuid__": "b5GMVvLH5E26y+XrNUq++o"
        },
        "fileId": "73HSqZtSpGJplnza2mfr92"
      },
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 22.25,
        "height": 50.4
      },
      "_anchorPoint": {
        "__type__": "cc.Vec2",
        "y": 0.5
      },
      "_position": {
        "__type__": "cc.Vec3",
        "x": 105.542
      }
    },
    {
      "__type__": "cc.Label",
      "node": {
        "__id__": 9
      },
      "_materials": [
        {
          "__uuid__": "ecpdLyjvZBwrvm+cedCcQy"
        }
      ],
      "_useOriginalSize": false,
      "_string": "0",
      "_N$string": "0",
      "_N$verticalAlign": 1
    }
  ],
  {
    "__type__": "cc.EffectAsset",
    "_name": "builtin-clear-stencil",
    "properties": {},
    "techniques": [
      {
        "passes": [
          {
            "cullMode": 0,
            "blend": true,
            "program": "ecffb93dd8898d482a87ab9b7d996968df31634fee23f1aa5de47906"
          }
        ],
        "layer": 0,
        "stages": [
          "opaque"
        ],
        "queue": 0,
        "priority": 0
      }
    ],
    "shaders": [
      {
        "vert": "\n#define _IS_VERT_SHADER 1\n\nprecision highp float;\n\nattribute vec3 a_position;\n\nvoid main () {\n  gl_Position = vec4(a_position, 1);\n}\n\n\n",
        "frag": "\n#define _IS_FRAG_SHADER 1\n\nprecision highp float;\n\nvoid main () {\n  gl_FragColor = vec4(1.0);\n}\n\n\n",
        "defines": [],
        "uniforms": [],
        "attributes": [
          {
            "name": "a_position",
            "type": 6,
            "defines": []
          }
        ],
        "extensions": [],
        "name": "ecffb93dd8898d482a87ab9b7d996968df31634fee23f1aa5de47906"
      }
    ]
  },
  {
    "__type__": "cc.Material",
    "_name": "builtin-clear-stencil",
    "_effectAsset": {
      "__uuid__": "c0BAyVxX9JzZy8EjFrc9DU"
    },
    "_defines": {},
    "_props": {}
  },
  {
    "__type__": "cc.Texture2D",
    "content": "0,9729,9729,33071,33071,0,0,1"
  },
  {
    "__type__": "cc.Material",
    "_name": "builtin-2d-sprite",
    "_effectAsset": {
      "__uuid__": "28dPjdQWxEQIG3VVl1Qm6T"
    },
    "_defines": {
      "USE_TEXTURE": true
    },
    "_props": {}
  },
  {
    "__type__": "cc.SpriteFrame",
    "content": {
      "name": "bg2",
      "texture": "8emPYh4z5JubEJ7FyYsYX1",
      "rect": [
        0,
        0,
        100,
        100
      ],
      "offset": [
        0,
        0
      ],
      "originalSize": [
        100,
        100
      ],
      "capInsets": [
        0,
        0,
        0,
        0
      ]
    }
  }
];
