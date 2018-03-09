import { assert, expect } from 'chai';
import sinon from 'sinon';
import { version } from '../package.json';
import PWSDK from '../src/index';
import { getParameterByName, log } from '../src/utils';

describe('PWSDK', function () {

  context('when checking environment', function () {
    it('should show log when it\'s not in iframe', function () {
      const stub = sinon.stub(window, 'top');
      stub.returns(window);
      const spy = sinon.spy(log);

      assert(PWSDK.checkEnvironment());
      spy.calledOnce;
    });

    it('should not log when it\'s in iframe', function () {
      const stub = sinon.stub(window, 'top');
      stub.returns({});
      const spy = sinon.spy(log);

      assert(PWSDK.checkEnvironment());
      spy.notCalled;
    });
  });

  context('when using sdk public methods', function () {
    let sdk;
    let win;

    const origin = 'https://prosperworks.com';
    const instanceId = '1';

    beforeEach(function () {
      win = {
        addEventListener: window.addEventListener.bind(window),
        top: {
          postMessage: sinon.stub(),
        },
      };
      sdk = new PWSDK(origin, instanceId, win);
    });

    after(function () {
      sdk = null;
      win = null;
    });

    context('#getContext', function () {
      it('should be able to get context from parent', async function () {
        win.top.postMessage.callsFake(function () {
          window.dispatchEvent(new MessageEvent('message', {
            origin,
            data: {
              type: 'getContext',
              context: {
                id: '1',
                name: 'Alice',
              },
            },
          }));
        });
        const data = await sdk.getContext();
        expect(data.type).to.equal('getContext');
        expect(data.context).to.eql({
          id: '1',
          name: 'Alice',
        });
      });
    });

    context('#setAppUI', function () {
      it('should be able to receive ui settings', function () {
        sdk.setAppUI({ count: 0 });
        win.top.postMessage.calledWith(sinon.match((value) => {
          return expect(value).to.eql({
            type: 'setUI',
            instanceId,
            version,
            data: {
              count: 0,
            },
          });
        }));
      });
    });

    context('#showModal', function () {
      it('should be able to show modal', function () {
        sdk.showModal({ name: 'Alice' });
        win.top.postMessage.calledWith(sinon.match((value) => {
          return expect(value).to.eql({
            type: 'showModal',
            instanceId,
            version,
            params: {
              name: 'Alice',
            },
          });
        }));
      });
    });

    context('#closeModal', function () {
      it('should be able to close modal', function () {
        sdk.closeModal();
        win.top.postMessage.calledWith(sinon.match((value) => {
          return expect(value).to.eql({
            type: 'closeModal',
            instanceId,
            version,
          });
        }));
      });
    });

    context('#proxyMessage', function () {
      it('should be able to close modal', function () {
        sdk.proxyMessage('target', {
          yo: 42,
        });
        win.top.postMessage.calledWith(sinon.match((value) => {
          return expect(value).to.eql({
            type: 'proxyMessage',
            instanceId,
            version,
            target: 'target',
            data: {
              yo: 42,
            },
          });
        }));
      });
    });

    context('#on and #trigger', function () {
      it('should trigger methods and subscribe it correctly', function () {
        const spy1 = sinon.spy();
        sdk.on('myevent1', spy1);
        sdk.trigger('myevent1', { yo: 42 });
        sdk.trigger('myevent1', { yo: 42 });

        assert(spy1.calledTwice);
        assert(spy1.calledWithMatch(sinon.match.has('yo', 42)));
      });
    });
  });
});
